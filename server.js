import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { simpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// Static files
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change in production!
const GIT_USER_EMAIL = process.env.GIT_USER_EMAIL || 'admin@cathlab.local';
const GIT_USER_NAME = process.env.GIT_USER_NAME || 'Admin User';
const SYNC_INTERVAL = parseInt(process.env.SYNC_INTERVAL || '300000'); // 5 minutes default

let lastSyncTime = null;

// Initialize git
const git = simpleGit();

// Configure git user on startup
await git.addConfig('user.email', GIT_USER_EMAIL);
await git.addConfig('user.name', GIT_USER_NAME);

// Pull on startup
async function syncOnStartup() {
  try {
    console.log('🔄 Syncing with remote repository on startup...');
    await git.pull();
    lastSyncTime = new Date();
    console.log('✅ Repository synced successfully');
  } catch (error) {
    console.warn('⚠️  Initial sync warning:', error.message);
    // Don't fail startup if pull fails (could be initial setup)
  }
}

// Periodic auto-sync from remote
async function autoSyncFromRemote() {
  try {
    await git.pull();
    lastSyncTime = new Date();
    console.log(`🔄 Auto-sync complete at ${lastSyncTime.toISOString()}`);
  } catch (error) {
    console.warn('Auto-sync warning:', error.message);
  }
}

syncOnStartup();

// Start periodic sync
setInterval(autoSyncFromRemote, SYNC_INTERVAL);

// Simple session management
const sessions = new Map();

const SESSION_DURATION = 1000 * 60 * 60 * 24; // 24 hours

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

function createSession() {
  const token = generateSessionToken();
  const expiresAt = Date.now() + SESSION_DURATION;
  sessions.set(token, { expiresAt });
  return token;
}

function validateSession(token) {
  if (!sessions.has(token)) return false;
  const session = sessions.get(token);
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}

setInterval(cleanupExpiredSessions, 1000 * 60 * 10); // Cleanup every 10 minutes

// Authentication endpoint
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = createSession();
  res.json({ token, message: 'Logged in successfully' });
});

// Middleware to check admin session
function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || !validateSession(token)) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }

  next();
}

// Get current data
app.get('/api/admin/data', requireAdmin, async (req, res) => {
  try {
    // Pull latest from remote first
    await git.pull();
    lastSyncTime = new Date();

    const appJsPath = path.join(process.cwd(), 'app.js');
    const content = fs.readFileSync(appJsPath, 'utf-8');

    // Extract medication rows
    const medicationMatch = content.match(/const medicationQuickGuideRows = \[([\s\S]*?)\];/);
    let medications = [];
    if (medicationMatch) {
      try {
        // This is a simplified extraction - in production, use a proper parser
        medications = eval(`[${medicationMatch[1]}]`);
      } catch (e) {
        console.error('Error parsing medications:', e);
      }
    }

    res.json({
      medications,
      lastModified: fs.statSync(appJsPath).mtime,
      lastSynced: lastSyncTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update medications
app.post('/api/admin/medications', requireAdmin, async (req, res) => {
  try {
    const { medications, commitMessage } = req.body;

    if (!Array.isArray(medications)) {
      return res.status(400).json({ error: 'Medications must be an array' });
    }

    // Pull latest before editing
    await git.pull();

    const appJsPath = path.join(process.cwd(), 'app.js');
    let content = fs.readFileSync(appJsPath, 'utf-8');

    // Generate new medication rows code
    const medicationCode = medications
      .map(med => JSON.stringify(med, null, 2))
      .join(',\n  ');

    // Replace medication data
    const newContent = content.replace(
      /const medicationQuickGuideRows = \[([\s\S]*?)\];/,
      `const medicationQuickGuideRows = [\n  ${medicationCode}\n];`
    );

    fs.writeFileSync(appJsPath, newContent, 'utf-8');

    // Commit to git
    await git.add('app.js');
    await git.commit(commitMessage || 'Admin update: medications updated');
    await git.push();

    // Pull again to ensure local is fully in sync
    await git.pull();
    lastSyncTime = new Date();

    res.json({
      success: true,
      message: 'Medications updated and committed successfully',
      lastSynced: lastSyncTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update sections
app.post('/api/admin/sections', requireAdmin, async (req, res) => {
  try {
    const { sectionId, items, commitMessage } = req.body;

    if (!sectionId || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Section ID and items array required' });
    }

    // Pull latest before editing
    await git.pull();

    const appJsPath = path.join(process.cwd(), 'app.js');
    let content = fs.readFileSync(appJsPath, 'utf-8');

    // Create new items code
    const itemsCode = items
      .map(item => `"${item.replace(/"/g, '\\"')}"`)
      .join(',\n      ');

    // Use regex to find and replace the specific section's items
    const sectionRegex = new RegExp(
      `(id: "${sectionId}",[\\s\\S]*?items: \\[)[\\s\\S]*?(\\],)`,
      'g'
    );

    if (!sectionRegex.test(content)) {
      return res.status(404).json({ error: 'Section not found' });
    }

    const newContent = content.replace(
      sectionRegex,
      `$1\n      ${itemsCode}\n    $2`
    );

    fs.writeFileSync(appJsPath, newContent, 'utf-8');

    // Commit to git
    await git.add('app.js');
    await git.commit(commitMessage || `Admin update: Section ${sectionId} updated`);
    await git.push();

    // Pull again to ensure local is fully in sync
    await git.pull();
    lastSyncTime = new Date();

    res.json({
      success: true,
      message: 'Section updated and committed successfully',
      lastSynced: lastSyncTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync status endpoint
app.get('/api/admin/sync-status', requireAdmin, (req, res) => {
  res.json({
    lastSynced: lastSyncTime,
    syncInterval: SYNC_INTERVAL,
    nextSyncIn: lastSyncTime ? SYNC_INTERVAL - (Date.now() - lastSyncTime) : 'pending'
  });
});

// Logout
app.post('/api/admin/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    sessions.delete(token);
  }
  res.json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`✅ Cath Lab Binder server running on http://localhost:${PORT}`);
  console.log(`📘 Admin API available at http://localhost:${PORT}#admin`);
  console.log(`🔄 Auto-sync enabled every ${SYNC_INTERVAL / 1000}s`);
});
