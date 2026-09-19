// Etat partage de l'interface, restaure depuis le stockage du navigateur au chargement.
const state = {
  token: localStorage.getItem('natalis_token'),
  user: JSON.parse(localStorage.getItem('natalis_user') || 'null'),
  view: 'dashboard',
  editingId: null,
  records: [],
  pagination: { page: 1, totalPages: 1 },
  searchTimer: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Vercel expose l'API sous /api, alors que le serveur Express local utilise directement /.
const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? '' : '/api';

// Wrapper HTTP: ajoute automatiquement le JWT et transforme les erreurs API en exceptions.
const api = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(`${apiBase}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Erreur API:', response.status, response.url, data);
    throw new Error(data.message || `Erreur ${response.status} lors de l'appel API.`);
  }
  return data;
};

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
const formatDate = value => value ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';
const showToast = message => { const toast = $('#toast'); toast.textContent = message; toast.classList.add('visible'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('visible'), 3500); };
const showError = error => { if (error.message.includes('Token') || error.message.includes('authentification')) logout(); else showToast(error.message); };

// La session est conservee pour permettre de recharger la page sans se reconnecter.
function setSession(data) {
  state.token = data.token;
  state.user = data.utilisateur;
  localStorage.setItem('natalis_token', state.token);
  localStorage.setItem('natalis_user', JSON.stringify(state.user));
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('natalis_token');
  localStorage.removeItem('natalis_user');
  $('#app-screen').classList.add('hidden');
  $('#auth-screen').classList.remove('hidden');
}

function updateIdentity() {
  const user = state.user || { nom: 'Utilisateur', role: 'agent' };
  const firstLetter = user.nom.charAt(0).toUpperCase();
  $('#user-avatar').textContent = firstLetter;
  $('#user-name').textContent = user.nom;
  $('#user-role').textContent = user.role === 'admin' ? 'Administrateur' : 'Agent habilité';
  $$('.admin-only').forEach(item => item.classList.toggle('hidden', user.role !== 'admin'));
}

function openApp() {
  $('#auth-screen').classList.add('hidden');
  $('#app-screen').classList.remove('hidden');
  updateIdentity();
  renderView('dashboard');
}

function renderView(view) {
  // Les templates HTML sont clones dans le conteneur, puis la vue charge ses donnees.
  if (view === 'users' && state.user?.role !== 'admin') return renderView('dashboard');
  state.view = view;
  const template = document.getElementById(`${view === 'new-record' ? 'form' : view}-template`);
  if (!template) return;
  $('#view-container').replaceChildren(template.content.cloneNode(true));
  $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === view));
  const titles = { dashboard: "Vue d'ensemble", records: 'Registre des naissances', 'new-record': 'Nouvel enregistrement', users: 'Utilisateurs' };
  $('#page-title').textContent = titles[view];
  if (view === 'dashboard') loadDashboard();
  if (view === 'records') loadRecords();
  if (view === 'users') loadUsers();
  if (view === 'new-record') setupRecordForm();
  $('.sidebar')?.classList.remove('open');
}

async function loadDashboard() {
  try {
    // Les statistiques et les actes recents sont independants et charges en parallele.
    const [stats, records] = await Promise.all([api('/naissances/statistiques'), api('/naissances?limit=5&page=1')]);
    const girls = stats.parSexe.find(item => /fille|féminin/i.test(item._id))?.total || 0;
    const boys = stats.parSexe.find(item => /garçon|garcon|masculin/i.test(item._id))?.total || 0;
    const total = stats.total || 0;
    $('#welcome-name').textContent = (state.user?.nom || 'Utilisateur').split(' ')[0];
    $('#metric-total').textContent = total;
    $('#metric-girls').textContent = girls;
    $('#metric-boys').textContent = boys;
    $('#metric-places').textContent = stats.parLieu.length;
    $('#metric-girls-rate').textContent = `${total ? Math.round(girls / total * 100) : 0}% du total`;
    $('#metric-boys-rate').textContent = `${total ? Math.round(boys / total * 100) : 0}% du total`;
    $('#legend-girls').textContent = girls;
    $('#legend-boys').textContent = boys;
    $('#donut-total').textContent = total;
    const girlsRate = total ? girls / total * 100 : 50;
    $('#sex-donut').style.background = `conic-gradient(var(--blue) 0 ${girlsRate}%, var(--coral) ${girlsRate}% 100%)`;
    $('#recent-records').innerHTML = records.naissances.length ? records.naissances.map(recordRow).join('') : emptyRow(6, 'Aucun enregistrement pour le moment.');
  } catch (error) { showError(error); }
}

const recordActions = record => state.user?.role === 'admin' ? `<div class="row-actions"><button class="small-action" data-action="edit-record" data-id="${record._id}" aria-label="Modifier">✎</button><button class="small-action danger" data-action="delete-record" data-id="${record._id}" aria-label="Supprimer">×</button></div>` : '<span class="muted">Lecture</span>';
const recordRow = record => `<tr><td>${escapeHtml(record.numeroActe)}</td><td><div class="child-name"><strong>${escapeHtml(record.nomEnfant)} ${escapeHtml(record.prenomEnfant)}</strong><small>${escapeHtml(record.sexe)}</small></div></td><td><div class="parent-info"><strong>${escapeHtml(record.nomPere)}</strong><small>${escapeHtml(record.nomMere)}</small></div></td><td><div class="date-place"><strong>${formatDate(record.dateNaissance)}</strong><small>${escapeHtml(record.lieuNaissance)}</small></div></td><td><span class="sex-badge ${/fille/i.test(record.sexe) ? 'sex-fille' : 'sex-garcon'}">${escapeHtml(record.sexe)}</span></td><td>${recordActions(record)}</td></tr>`;
const simpleRecordRow = record => `<tr><td>${escapeHtml(record.numeroActe)}</td><td><div class="child-name"><strong>${escapeHtml(record.nomEnfant)} ${escapeHtml(record.prenomEnfant)}</strong><small>${escapeHtml(record.sexe)}</small></div></td><td><div class="parent-info"><strong>${escapeHtml(record.nomPere)}</strong><small>${escapeHtml(record.nomMere)}</small></div></td><td><div class="date-place"><strong>${formatDate(record.dateNaissance)}</strong><small>${escapeHtml(record.lieuNaissance)}</small></div></td><td><span class="sex-badge ${/fille/i.test(record.sexe) ? 'sex-fille' : 'sex-garcon'}">${escapeHtml(record.sexe)}</span></td><td>${recordActions(record)}</td></tr>`;
const emptyRow = (columns, text) => `<tr><td colspan="${columns}" class="empty-state">${text}</td></tr>`;

async function loadRecords(page = 1) {
  try {
    // La recherche est encodee avant d'etre envoyee dans la query string.
    const search = $('#record-search')?.value.trim() || '';
    const data = await api(`/naissances?page=${page}&limit=10&recherche=${encodeURIComponent(search)}`);
    state.records = data.naissances;
    state.pagination = data;
    $('#records-body').innerHTML = data.naissances.length ? data.naissances.map(simpleRecordRow).join('') : emptyRow(6, 'Aucun dossier ne correspond à votre recherche.');
    renderPagination(data);
  } catch (error) { showError(error); }
}

function renderPagination(data) {
  const pagination = $('#pagination');
  if (!pagination || data.totalPages <= 1) { if (pagination) pagination.innerHTML = ''; return; }
  pagination.innerHTML = Array.from({ length: data.totalPages }, (_, index) => `<button class="page-button ${data.page === index + 1 ? 'active' : ''}" data-action="page" data-page="${index + 1}">${index + 1}</button>`).join('');
}

function setupRecordForm() {
  const form = $('#record-form');
  if (state.editingId) $('#form-title').textContent = 'Modifier une naissance';
  if (state.editingId) {
    const record = state.records.find(item => item._id === state.editingId);
    if (record) Object.entries(record).forEach(([key, value]) => { const field = form.elements[key]; if (field) field.value = key === 'dateNaissance' ? new Date(value).toISOString().slice(0, 10) : value; });
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    // Le meme formulaire sert a la creation et a la modification selon editingId.
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const method = state.editingId ? 'PUT' : 'POST';
      await api(state.editingId ? `/naissances/${state.editingId}` : '/naissances', { method, body: JSON.stringify(payload) });
      showToast(state.editingId ? 'Dossier modifié avec succès.' : 'Naissance enregistrée avec succès.');
      state.editingId = null;
      renderView('records');
    } catch (error) { showError(error); }
  });
}

async function editRecord(id) { state.editingId = id; renderView('new-record'); }
async function deleteRecord(id) {
  if (!window.confirm('Supprimer définitivement ce dossier de naissance ?')) return;
  try { await api(`/naissances/${id}`, { method: 'DELETE' }); showToast('Dossier supprimé.'); loadRecords(state.pagination.page || 1); } catch (error) { showError(error); }
}

async function loadUsers() {
  try {
    const data = await api('/utilisateurs');
    $('#users-body').innerHTML = data.utilisateurs.length ? data.utilisateurs.map(user => `<tr><td><div class="child-name"><strong>${escapeHtml(user.nom)}</strong><small>${user._id}</small></div></td><td>${escapeHtml(user.email)}</td><td><span class="role-badge users-role">${escapeHtml(user.role)}</span></td><td>${formatDate(user.createdAt)}</td><td><div class="row-actions"><button class="small-action danger" data-action="delete-user" data-id="${user._id}">×</button></div></td></tr>`).join('') : emptyRow(5, 'Aucun utilisateur.');
  } catch (error) { showError(error); }
}

function addUser() {
  const modal = $('#user-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  $('#user-form input[name="nom"]').focus();
}

function closeUserModal() {
  const modal = $('#user-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  $('#user-form').reset();
}

function openHelp() {
  $('#help-modal')?.classList.remove('hidden');
}

function closeHelp() {
  $('#help-modal')?.classList.add('hidden');
}

async function submitUser(event) {
  event.preventDefault();
  // L'ecouteur est place sur document: currentTarget vaut document, target vaut le formulaire.
  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  try {
    await api('/utilisateurs', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
    closeUserModal();
    showToast('Utilisateur créé avec succès.');
    loadUsers();
  } catch (error) {
    showError(error);
  } finally {
    submitButton.disabled = false;
  }
}

async function deleteUser(id) {
  if (!window.confirm('Supprimer cet utilisateur ?')) return;
  try { await api(`/utilisateurs/${id}`, { method: 'DELETE' }); showToast('Utilisateur supprimé.'); loadUsers(); } catch (error) { showError(error); }
}

async function exportRecords() {
  try {
    const data = await api('/naissances?limit=10000&page=1');
    const jsPDF = window.jspdf?.jsPDF;
    if (!jsPDF) throw new Error('Le module PDF est indisponible. Rechargez la page puis réessayez.');

    const documentPdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    documentPdf.setFontSize(18);
    documentPdf.text('Registre des naissances', 14, 16);
    documentPdf.setFontSize(9);
    documentPdf.setTextColor(100);
    documentPdf.text(`Export du ${new Date().toLocaleDateString('fr-FR')} - ${data.total} acte(s)`, 14, 23);

    documentPdf.autoTable({
      startY: 30,
      head: [['Numero acte', 'Enfant', 'Sexe', 'Date naissance', 'Lieu', 'Pere', 'Mere']],
      body: data.naissances.map(item => [
        item.numeroActe,
        `${item.nomEnfant} ${item.prenomEnfant}`,
        item.sexe,
        formatDate(item.dateNaissance),
        item.lieuNaissance,
        item.nomPere,
        item.nomMere
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [18, 60, 58] },
      alternateRowStyles: { fillColor: [240, 246, 244] },
      margin: { left: 14, right: 14 }
    });

    documentPdf.save('registre-naissances.pdf');
    showToast('Registre PDF téléchargé.');
  } catch (error) { showError(error); }
}

// Delegation d'evenements: les boutons des templates dynamiques restent fonctionnels.
document.addEventListener('click', event => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) { state.editingId = null; renderView(viewButton.dataset.view); $('#app-screen .sidebar')?.classList.remove('open'); return; }
  const action = event.target.closest('[data-action]');
  if (!action) return;
  const actions = { logout, refresh: () => renderView(state.view), 'open-sidebar': () => $('.sidebar').classList.add('open'), 'close-sidebar': () => $('.sidebar').classList.remove('open'), 'load-records': () => loadRecords(), 'new-user': addUser, 'close-user-modal': closeUserModal, 'open-help': openHelp, 'close-help': closeHelp, export: exportRecords, 'edit-record': () => editRecord(action.dataset.id), 'delete-record': () => deleteRecord(action.dataset.id), 'delete-user': () => deleteUser(action.dataset.id), page: () => loadRecords(Number(action.dataset.page)) };
  actions[action.dataset.action]?.();
});

document.addEventListener('submit', event => {
  if (event.target.id === 'user-form') submitUser(event);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('#user-modal')?.classList.contains('hidden')) closeUserModal();
  if (event.key === 'Escape' && !$('#help-modal')?.classList.contains('hidden')) closeHelp();
});

document.addEventListener('input', event => {
  if (event.target.id !== 'record-search') return;
  clearTimeout(state.searchTimer);
  state.searchTimer = setTimeout(() => loadRecords(1), 300);
});

$('#login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const button = event.target.querySelector('button[type="submit"]');
  button.disabled = true;
  try { const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target).entries())) }); setSession(data); openApp(); } catch (error) { showToast(error.message); } finally { button.disabled = false; }
});

$$('[data-action="toggle-password"]').forEach(button => button.addEventListener('click', () => { const input = button.parentElement.querySelector('input'); input.type = input.type === 'password' ? 'text' : 'password'; }));

if (state.token && state.user) openApp();
