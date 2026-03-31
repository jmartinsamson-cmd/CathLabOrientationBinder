// Guard to disable admin UI and API calls on GitHub Pages (fail silently)
(function () {
  if (typeof window === 'undefined') return;
  if (window.location && window.location.hostname && window.location.hostname.endsWith('github.io')) {
    // Do nothing on GitHub Pages. Admin requires a backend.
    return;
  }
})();

/* Admin Panel for Cath Lab Orientation Binder */

let adminToken = null;

// Store token in sessionStorage
function setAdminToken(token) {
  adminToken = token;
  sessionStorage.setItem('adminToken', token);
}

function getAdminToken() {
  if (!adminToken) {
    adminToken = sessionStorage.getItem('adminToken');
  }
  return adminToken;
}

function clearAdminToken() {
  adminToken = null;
  sessionStorage.removeItem('adminToken');
}

// Create admin modal
function createAdminModal() {
  const modal = document.createElement('div');
  modal.id = 'adminModal';
  modal.className = 'admin-modal hidden';
  modal.innerHTML = `
    <div class="admin-modal-overlay"></div>
    <div class="admin-modal-content">
      <button class="admin-modal-close" type="button">&times;</button>
      
      <div id="adminLoginPanel" class="admin-panel">
        <h2>Admin Login</h2>
        <p class="muted">Enter password to access admin controls</p>
        <div class="form-group">
          <label for="adminPassword">Password</label>
          <input id="adminPassword" type="password" placeholder="Enter admin password" />
        </div>
        <button id="adminLoginBtn" class="btn btn-primary" type="button">Login</button>
        <p id="adminLoginError" class="error-message" hidden></p>
      </div>

      <div id="adminControlsPanel" class="admin-panel hidden">
        <div class="admin-header">
          <h2>Admin Controls</h2>
          <button id="adminLogoutBtn" class="btn btn-small" type="button">Logout</button>
        </div>

        <div class="admin-tabs">
          <button class="admin-tab-btn active" data-tab="medications">Edit Medications</button>
          <button class="admin-tab-btn" data-tab="sections">Edit Sections</button>
        </div>

        <div id="medicationsTab" class="admin-tab-content active">
          <h3>Medications</h3>
          <p class="muted">Edit medication quick reference guide</p>
          <div id="medicationsList" class="medications-list"></div>
          <button id="addMedicationBtn" class="btn" type="button">+ Add Medication</button>
          <button id="saveMedicationsBtn" class="btn btn-primary" type="button">Save Changes</button>
          <p id="medicationsSaveStatus" class="muted" hidden></p>
        </div>

        <div id="sectionsTab" class="admin-tab-content hidden">
          <h3>Sections</h3>
          <p class="muted">Edit training section competencies</p>
          <div class="form-group">
            <label for="sectionSelector">Select Section</label>
            <select id="sectionSelector">
              <option value="">-- Choose a section --</option>
            </select>
          </div>
          <div id="sectionItemsList" class="section-items-list"></div>
          <button id="addItemBtn" class="btn" type="button">+ Add Item</button>
          <button id="saveSectionBtn" class="btn btn-primary" type="button">Save Section Changes</button>
          <p id="sectionSaveStatus" class="muted" hidden></p>
        </div>
      </div>
    </div>
  `;
  
document.body.appendChild(modal);
  attachAdminEventListeners();
}

function showAdminModal() {
  const modal = document.getElementById('adminModal');
  if (!modal) {
    createAdminModal();
  }
  document.getElementById('adminModal').classList.remove('hidden');
}

function hideAdminModal() {
  const modal = document.getElementById('adminModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function attachAdminEventListeners() {
  // Close modal
  document.querySelector('.admin-modal-close')?.addEventListener('click', hideAdminModal);
  document.querySelector('.admin-modal-overlay')?.addEventListener('click', hideAdminModal);

  // Login
  document.getElementById('adminLoginBtn')?.addEventListener('click', handleAdminLogin);
  document.getElementById('adminPassword')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAdminLogin();
  });

  // Logout
  document.getElementById('adminLogoutBtn')?.addEventListener('click', handleAdminLogout);

  // Tabs
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => switchAdminTab(e.target.dataset.tab));
  });

  // Medications
  document.getElementById('addMedicationBtn')?.addEventListener('click', addMedicationRow);
  document.getElementById('saveMedicationsBtn')?.addEventListener('click', saveMedications);

  // Sections
  document.getElementById('sectionSelector')?.addEventListener('change', loadSectionItems);
  document.getElementById('addItemBtn')?.addEventListener('click', addSectionItem);
  document.getElementById('saveSectionBtn')?.addEventListener('click', saveSectionChanges);
}

async function handleAdminLogin() {
  const password = document.getElementById('adminPassword').value;
  const errorEl = document.getElementById('adminLoginError');
  
  if (!password) {
    errorEl.textContent = 'Password required';
    errorEl.removeAttribute('hidden');
    return;
  }

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      throw new Error('Invalid password');
    }

    const data = await response.json();
    setAdminToken(data.token);
    
    document.getElementById('adminLoginPanel').classList.add('hidden');
    document.getElementById('adminControlsPanel').classList.remove('hidden');
    
    // Load medications
    await loadMedications();
    // Load sections list
    loadSectionsList();
  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.removeAttribute('hidden');
  }
}

async function handleAdminLogout() {
  const token = getAdminToken();
  if (token) {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
  
  clearAdminToken();
  document.getElementById('adminControlsPanel').classList.add('hidden');
  document.getElementById('adminLoginPanel').classList.remove('hidden');
  document.getElementById('adminPassword').value = '';
  document.getElementById('adminLoginError').setAttribute('hidden', '');
  hideAdminModal();
}

async function loadMedications() {
  const token = getAdminToken();
  try {
    const response = await fetch('/api/admin/data', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to load medications');
    
    const data = await response.json();
    displayMedications(data.medications);
  } catch (error) {
    alert('Error loading medications: ' + error.message);
  }
}

function displayMedications(medications) {
  const list = document.getElementById('medicationsList');
  list.innerHTML = '';
  
  medications.forEach((med, index) => {
    const medDiv = document.createElement('div');
    medDiv.className = 'medication-editor';
    medDiv.dataset.index = index;
    medDiv.innerHTML = `
      <div class="form-group">
        <label>Medication Name</label>
        <input type="text" class="med-name" value="${med.medication || ''}" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Mix/Preparation</label>
          <input type="text" class="med-mix" value="${med.mix || ''}" />
        </div>
        <div class="form-group">
          <label>Starting Dose</label>
          <input type="text" class="med-start" value="${med.start || ''}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Titration</label>
          <input type="text" class="med-titration" value="${med.titration || ''}" />
        </div>
        <div class="form-group">
          <label>Maximum Dose</label>
          <input type="text" class="med-max" value="${med.max || ''}" />
        </div>
      </div>
      <div class="form-group">
        <label>Clinical Notes</label>
        <textarea class="med-notes">${med.notes || ''}</textarea>
      </div>
      <button class="btn btn-danger btn-small remove-med" type="button">Remove</button>
      <hr />
    `;
    
    medDiv.querySelector('.remove-med').addEventListener('click', (e) => {
      e.target.closest('.medication-editor').remove();
    });
    
    list.appendChild(medDiv);
  });
}

function addMedicationRow() {
  const list = document.getElementById('medicationsList');
  
  list.insertAdjacentHTML('beforeend', `
    <div class="medication-editor" data-index="new">
      <div class="form-group">
        <label>Medication Name</label>
        <input type="text" class="med-name" value="New Medication" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Mix/Preparation</label>
          <input type="text" class="med-mix" value="" />
        </div>
        <div class="form-group">
          <label>Starting Dose</label>
          <input type="text" class="med-start" value="" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Titration</label>
          <input type="text" class="med-titration" value="" />
        </div>
        <div class="form-group">
          <label>Maximum Dose</label>
          <input type="text" class="med-max" value="" />
        </div>
      </div>
      <div class="form-group">
        <label>Clinical Notes</label>
        <textarea class="med-notes"></textarea>
      </div>
      <button class="btn btn-danger btn-small remove-med" type="button">Remove</button>
      <hr />
    </div>
  `);
  
  document.querySelector('.medication-editor:last-child .remove-med').addEventListener('click', (e) => {
    e.target.closest('.medication-editor').remove();
  });
}

async function saveMedications() {
  const token = getAdminToken();
  const statusEl = document.getElementById('medicationsSaveStatus');
  
  const medications = [];
  document.querySelectorAll('.medication-editor').forEach(medDiv => {
    medications.push({
      medication: medDiv.querySelector('.med-name').value,
      mix: medDiv.querySelector('.med-mix').value,
      start: medDiv.querySelector('.med-start').value,
      titration: medDiv.querySelector('.med-titration').value,
      max: medDiv.querySelector('.med-max').value,
      notes: medDiv.querySelector('.med-notes').value
    });
  });

  try {
    statusEl.textContent = 'Saving...';
    statusEl.removeAttribute('hidden');
    
    const response = await fetch('/api/admin/medications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        medications,
        commitMessage: 'Admin update: medications edited via web interface'
      })
    });

    if (!response.ok) throw new Error('Save failed');

    await response.json();
    statusEl.textContent = '✓ Medications saved and committed to git!';
    setTimeout(() => statusEl.setAttribute('hidden', ''), 3000);
  } catch (error) {
    statusEl.textContent = '✗ Error: ' + error.message;
  }
}

function loadSectionsList() {
  const selector = document.getElementById('sectionSelector');
  // This assumes sections are available globally from app.js
  if (typeof sections !== 'undefined') {
    sections.forEach(section => {
      if (section.role === 'rn') {
        const option = document.createElement('option');
        option.value = section.id;
        option.textContent = section.title;
        selector.appendChild(option);
      }
    });
  }
}

function loadSectionItems() {
  const selector = document.getElementById('sectionSelector');
  const sectionId = selector.value;
  const list = document.getElementById('sectionItemsList');
  
  if (!sectionId) {
    list.innerHTML = '';
    return;
  }

  const section = sections.find(s => s.id === sectionId);
  if (!section) return;

  list.innerHTML = '';
  section.items.forEach((item, idx) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'section-item-editor';
    itemDiv.innerHTML = `
      <div class="form-group">
        <label>Item ${idx + 1}</label>
        <textarea class="section-item" data-index="${idx}">${item}</textarea>
      </div>
      <button class="btn btn-danger btn-small remove-item" type="button">Remove</button>
    `;
    
    itemDiv.querySelector('.remove-item').addEventListener('click', () => {
      itemDiv.remove();
    });
    
    list.appendChild(itemDiv);
  });
}

function addSectionItem() {
  const list = document.getElementById('sectionItemsList');
  
  const itemDiv = document.createElement('div');
  itemDiv.className = 'section-item-editor';
  itemDiv.innerHTML = `
    <div class="form-group">
      <label>New Item</label>
      <textarea class="section-item" data-index="new"></textarea>
    </div>
    <button class="btn btn-danger btn-small remove-item" type="button">Remove</button>
  `;
  
  itemDiv.querySelector('.remove-item').addEventListener('click', () => {
    itemDiv.remove();
  });
  
  list.appendChild(itemDiv);
}

async function saveSectionChanges() {
  const token = getAdminToken();
  const selector = document.getElementById('sectionSelector');
  const sectionId = selector.value;
  const statusEl = document.getElementById('sectionSaveStatus');
  
  if (!sectionId) {
    alert('Please select a section');
    return;
  }

  const items = [];
  document.querySelectorAll('.section-item').forEach(textarea => {
    const value = textarea.value.trim();
    if (value) items.push(value);
  });

  try {
    statusEl.textContent = 'Saving...';
    statusEl.removeAttribute('hidden');
    
    const response = await fetch('/api/admin/sections', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sectionId,
        items,
        commitMessage: `Admin update: Section ${sectionId} edited via web interface`
      })
    });

    if (!response.ok) throw new Error('Save failed');

    await response.json();
    statusEl.textContent = '✓ Section saved and committed to git!';
    setTimeout(() => statusEl.setAttribute('hidden', ''), 3000);
  } catch (error) {
    statusEl.textContent = '✗ Error: ' + error.message;
  }
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.add('hidden'));
  
  // Note: use the globally scoped event (existing behavior) if present
  event.target.classList.add('active');
  document.getElementById(tabName + 'Tab').classList.remove('hidden');
}

// Initialize admin button in header
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header .topbar');
  if (header) {
    const adminBtn = document.createElement('button');
    adminBtn.id = 'adminBtn';
    adminBtn.className = 'btn btn-admin';
    adminBtn.textContent = '⚙️ Admin';
    adminBtn.type = 'button';
    adminBtn.addEventListener('click', showAdminModal);
    header.appendChild(adminBtn);
  }
});