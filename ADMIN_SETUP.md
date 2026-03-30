# Admin Panel Setup Guide

The Cath Lab Orientation Binder now includes an **Admin Panel** for managing medications and training sections directly from the web interface. Changes automatically sync to the git repository.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
# Server port
PORT=3000

# Admin password (change this to a secure password!)
ADMIN_PASSWORD=your_secure_password_here

# Git configuration (for commit messages)
GIT_USER_EMAIL=admin@cathlab.local
GIT_USER_NAME=Admin User

# Auto-sync interval in milliseconds (default 5 minutes)
SYNC_INTERVAL=300000
```

## Auto-Sync Feature

Your local folder **automatically stays in sync** with the remote git repository:

- **On startup**: Pulls latest changes from remote when server starts
- **Before editing**: Pulls latest before admin makes any changes
- **After saving**: Pulls again after pushing changes to ensure 100% sync
- **Periodic sync**: Auto-pulls every 5 minutes (configurable via `SYNC_INTERVAL`)

This ensures:
- ✅ Your local files never get out of sync with the remote repo
- ✅ Merge conflicts are minimized
- ✅ Changes from other sources automatically pull in
- ✅ You always have the latest version when editing

### 3. Start the Server

**Development mode with auto-reload:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

### 4. Access Admin Panel

- Open the binder in your browser: `http://localhost:3000`
- Click the **⚙️ Admin** button in the top-right corner
- Enter your admin password to login

## Admin Features

### Edit Medications

1. Go to the **Edit Medications** tab
2. Click into any medication field to edit
3. Use **+ Add Medication** to create new entries
4. Click **Remove** to delete medications
5. Click **Save Changes** to commit updates to git

### Edit Training Sections

1. Go to the **Edit Sections** tab
2. Select a section from the dropdown
3. Edit or add competency items
4. Click **Save Section Changes** to commit

## Security Notes

⚠️ **Important:**
- Change the `ADMIN_PASSWORD` in `.env` to a strong, unique password
- Never commit `.env` to git (it's in `.gitignore`)
- The admin panel uses simple token-based sessions (suitable for internal use only)
- For production deployment, consider:
  - Using environment variable for password instead of .env file
  - Adding HTTPS/SSL
  - Using a database for session management
  - Rate limiting on login endpoint

## How It Works

1. **Authentication**: Admin enters password → Backend validates → Creates session token
2. **Editing**: Admin edits medications/sections → Frontend sends changes to backend API
3. **Saving**: Backend writes JavaScript code to `app.js` → Runs git commands → Commits and pushes changes

## Troubleshooting

### Git push fails
- Verify git is configured with credentials: `git config --list`
- For GitHub: Use personal access token if 2FA is enabled
- Check `.env` has correct `GIT_USER_EMAIL` and `GIT_USER_NAME`

### Changes not appearing
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors (F12)
- Verify server is still running

### Server won't start
- Check port 3000 is not already in use
- Verify Node.js is installed: `node --version`
- Check all dependencies installed: `npm install`

## API Endpoints (for reference)

All endpoints require `Authorization: Bearer <token>` header

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/login` | Authenticate with password |
| GET | `/api/admin/data` | Fetch current medications |
| POST | `/api/admin/medications` | Update medications and commit to git |
| POST | `/api/admin/sections` | Update section items and commit to git |
| POST | `/api/admin/logout` | Destroy session |
