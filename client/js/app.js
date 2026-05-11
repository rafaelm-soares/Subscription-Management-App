/**
 * client/js/app.js
 * Application entry point.
 * Wires UI events → API calls → UI renders.
 * No business logic here — delegate to api.js and ui.js.
 */

import * as api from './api.js';
import * as ui  from './ui.js';
import { toMonthly, todayISO } from './utils.js';

// ── STATE ────────────────────────────────────────────────────────────────────
const state = {
  currentView: 'dashboard',
  upcomingDays: 7,
  deleteTargetId: null,
};

// ── NAVIGATION ───────────────────────────────────────────────────────────────
const VIEW_TITLES = {
  dashboard:     'Dashboard',
  subscriptions: 'Subscriptions',
  upcoming:      'Upcoming Payments',
};

function navigateTo(viewName) {
  if (!VIEW_TITLES[viewName]) return;

  // Update sidebar
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === viewName);
  });

  // Update sections
  document.querySelectorAll('.view').forEach(el => {
    el.classList.toggle('active', el.id === `view-${viewName}`);
  });

  // Update topbar
  document.getElementById('view-title').textContent = VIEW_TITLES[viewName];

  // Show/hide topbar extras
  const daysFilter = document.getElementById('days-filter');
  const addBtn     = document.getElementById('btn-add-topbar');
  daysFilter.style.display = viewName === 'upcoming'      ? 'flex'  : 'none';
  addBtn.style.display     = viewName === 'subscriptions' ? 'flex'  : 'none';

  state.currentView = viewName;
  loadView(viewName);
}

// ── DATA LOADING ─────────────────────────────────────────────────────────────
async function loadView(view) {
  if (view === 'dashboard')     return loadDashboard();
  if (view === 'subscriptions') return loadSubscriptions();
  if (view === 'upcoming')      return loadUpcoming();
}

async function loadDashboard() {
  const [statsRes, upcomingRes] = await Promise.all([
    api.getStats(),
    api.getUpcoming(7),
  ]);

  if (statsRes.success) {
    const upcoming7 = upcomingRes.success ? upcomingRes.data : [];
    ui.renderStats(statsRes.data, upcoming7.length);
    ui.renderCategories(statsRes.data.categories, statsRes.data.totalMonthly);
    ui.renderAlertStrip(upcoming7);
  }

  const subsRes = await api.getSubscriptions();
  if (subsRes.success) {
    ui.renderDashboardList(subsRes.data);
  }
}

async function loadSubscriptions() {
  const res = await api.getSubscriptions();
  if (res.success) {
    ui.renderTable(res.data, openEditModal, openDeleteConfirm);
  }
}

async function loadUpcoming() {
  const res = await api.getUpcoming(state.upcomingDays);
  if (res.success) {
    ui.renderUpcoming(res.data);
  }
}

// ── MODAL: ADD / EDIT ────────────────────────────────────────────────────────
function openAddModal() {
  clearForm();
  document.getElementById('modal-title').textContent = 'Add Subscription';
  document.getElementById('btn-submit').textContent  = 'Save Subscription';
  document.getElementById('form-next-payment').value = todayISO();
  openModal('modal-overlay');
}

async function openEditModal(id) {
  const res = await api.getSubscription(id);
  if (!res.success) { ui.showToast('Could not load subscription', 'error'); return; }

  const s = res.data;
  clearForm();
  document.getElementById('modal-title').textContent   = 'Edit Subscription';
  document.getElementById('btn-submit').textContent    = 'Update Subscription';
  document.getElementById('form-id').value             = s.id;
  document.getElementById('form-name').value           = s.name;
  document.getElementById('form-price').value          = s.price;
  document.getElementById('form-billing').value        = s.billingCycle;
  document.getElementById('form-next-payment').value   = s.nextPayment;
  document.getElementById('form-category').value       = s.category;
  updatePreview();
  openModal('modal-overlay');
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function clearForm() {
  document.getElementById('form-id').value           = '';
  document.getElementById('form-name').value         = '';
  document.getElementById('form-price').value        = '';
  document.getElementById('form-billing').value      = 'monthly';
  document.getElementById('form-next-payment').value = '';
  document.getElementById('form-category').value     = 'other';
  clearFormErrors();
  updatePreview();
}

function clearFormErrors() {
  ['err-name', 'err-price', 'err-next'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
}

// ── FORM VALIDATION ──────────────────────────────────────────────────────────
function validateForm() {
  let valid = true;
  clearFormErrors();

  const name  = document.getElementById('form-name').value.trim();
  const price = document.getElementById('form-price').value;
  const next  = document.getElementById('form-next-payment').value;

  if (!name) {
    document.getElementById('err-name').textContent = 'Service name is required';
    valid = false;
  }

  if (!price || isNaN(price) || Number(price) <= 0) {
    document.getElementById('err-price').textContent = 'Enter a valid price greater than 0';
    valid = false;
  }

  if (!next || isNaN(new Date(next).getTime())) {
    document.getElementById('err-next').textContent = 'Select a valid date';
    valid = false;
  }

  return valid;
}

// ── FORM SUBMIT ──────────────────────────────────────────────────────────────
async function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const id = document.getElementById('form-id').value;
  const data = {
    name:        document.getElementById('form-name').value.trim(),
    price:       Number(document.getElementById('form-price').value),
    billingCycle: document.getElementById('form-billing').value,
    nextPayment: document.getElementById('form-next-payment').value,
    category:    document.getElementById('form-category').value,
  };

  let res;
  if (id) {
    res = await api.updateSubscription(Number(id), data);
  } else {
    res = await api.createSubscription(data);
  }

  if (res.success) {
    closeModal('modal-overlay');
    ui.showToast(id ? 'Subscription updated!' : 'Subscription added!', 'success');
    loadView(state.currentView);
    // Always refresh dashboard stats too
    if (state.currentView !== 'dashboard') loadDashboard();
  } else {
    ui.showToast(res.error || 'Something went wrong', 'error');
  }
}

// ── LIVE PREVIEW (form) ──────────────────────────────────────────────────────
function updatePreview() {
  const price   = Number(document.getElementById('form-price').value);
  const cycle   = document.getElementById('form-billing').value;
  const preview = document.getElementById('preview-monthly');

  if (!price || isNaN(price) || price <= 0) {
    preview.textContent = '—';
    return;
  }

  const monthly = toMonthly(price, cycle);
  preview.textContent = `€${monthly.toFixed(2)} / month`;
}

// ── DELETE CONFIRM ───────────────────────────────────────────────────────────
function openDeleteConfirm(id, name) {
  state.deleteTargetId = id;
  document.getElementById('delete-name').textContent = name;
  openModal('delete-overlay');
}

async function handleDeleteConfirm() {
  const id  = state.deleteTargetId;
  if (!id) return;

  const res = await api.deleteSubscription(id);
  closeModal('delete-overlay');
  state.deleteTargetId = null;

  if (res.success) {
    ui.showToast('Subscription deleted', 'success');
    loadView(state.currentView);
    if (state.currentView !== 'dashboard') loadDashboard();
  } else {
    ui.showToast(res.error || 'Delete failed', 'error');
  }
}

// ── EVENT LISTENERS ──────────────────────────────────────────────────────────
function bindEvents() {
  // Sidebar + inline navigation links
  document.addEventListener('click', e => {
    const navEl = e.target.closest('[data-view]');
    if (navEl) {
      e.preventDefault();
      navigateTo(navEl.dataset.view);
    }
  });

  // Open modal buttons
  document.getElementById('btn-add-new').addEventListener('click', openAddModal);
  document.getElementById('btn-add-topbar').addEventListener('click', openAddModal);

  // Empty state add buttons
  document.getElementById('btn-add-empty')?.addEventListener('click', openAddModal);
  document.getElementById('btn-add-empty-subs')?.addEventListener('click', openAddModal);

  // Modal close
  document.getElementById('modal-close').addEventListener('click', () => closeModal('modal-overlay'));
  document.getElementById('btn-cancel').addEventListener('click', () => closeModal('modal-overlay'));
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal('modal-overlay');
  });

  // Form submit
  document.getElementById('sub-form').addEventListener('submit', handleFormSubmit);

  // Live preview
  document.getElementById('form-price').addEventListener('input', updatePreview);
  document.getElementById('form-billing').addEventListener('change', updatePreview);

  // Delete modal
  document.getElementById('delete-close').addEventListener('click', () => closeModal('delete-overlay'));
  document.getElementById('delete-cancel').addEventListener('click', () => closeModal('delete-overlay'));
  document.getElementById('delete-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal('delete-overlay');
  });
  document.getElementById('delete-confirm').addEventListener('click', handleDeleteConfirm);

  // Upcoming days filter
  document.getElementById('days-select').addEventListener('change', e => {
    state.upcomingDays = Number(e.target.value);
    loadUpcoming();
  });

  // Keyboard: close modal on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('modal-overlay');
      closeModal('delete-overlay');
    }
  });
}

// ── INIT ─────────────────────────────────────────────────────────────────────
function init() {
  bindEvents();
  loadDashboard();
}

init();
