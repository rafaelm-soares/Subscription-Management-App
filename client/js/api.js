/**
 * client/js/api.js
 * Data access layer.
 *
 * Sprint 2: Uses in-memory mock data — no backend required.
 * Sprint 3: Replace mock functions with real fetch() calls to the Express API.
 *
 * All functions return Promises to keep the interface identical
 * to the real API layer (easy swap in Sprint 3).
 */

import { toMonthly, daysUntil } from './utils.js';

// ── MOCK DATA STORE ─────────────────────────────────────────────────────────
// Simulates the SQLite database in memory.
let _store = [
  {
    id: 1,
    name: 'Netflix',
    price: 15.99,
    billingCycle: 'monthly',
    nextPayment: _daysFromToday(3),
    category: 'entertainment',
    createdAt: '2025-01-10T10:00:00',
  },
  {
    id: 2,
    name: 'Spotify',
    price: 9.99,
    billingCycle: 'monthly',
    nextPayment: _daysFromToday(1),
    category: 'entertainment',
    createdAt: '2025-01-15T10:00:00',
  },
  {
    id: 3,
    name: 'GitHub Pro',
    price: 48.00,
    billingCycle: 'yearly',
    nextPayment: _daysFromToday(22),
    category: 'software',
    createdAt: '2025-02-01T10:00:00',
  },
  {
    id: 4,
    name: 'Gym',
    price: 29.90,
    billingCycle: 'monthly',
    nextPayment: _daysFromToday(0),
    category: 'fitness',
    createdAt: '2025-03-01T10:00:00',
  },
  {
    id: 5,
    name: 'Adobe CC',
    price: 599.88,
    billingCycle: 'yearly',
    nextPayment: _daysFromToday(45),
    category: 'software',
    createdAt: '2025-03-10T10:00:00',
  },
];

let _nextId = 6;

// Helper: returns a date string N days from today
function _daysFromToday(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// Simulate async network delay (ms)
const DELAY = 80;
function _fake(data) {
  return new Promise(resolve => setTimeout(() => resolve({ success: true, data }), DELAY));
}

// ── API FUNCTIONS ────────────────────────────────────────────────────────────
// These match the real API contract defined in project-spec.md.
// In Sprint 3, replace each function body with a fetch() call.

/**
 * GET /api/subscriptions
 */
export async function getSubscriptions() {
  return _fake([..._store]);
}

/**
 * GET /api/subscriptions/:id
 */
export async function getSubscription(id) {
  const sub = _store.find(s => s.id === id);
  if (!sub) return { success: false, error: 'Subscription not found' };
  return _fake({ ...sub });
}

/**
 * POST /api/subscriptions
 */
export async function createSubscription(data) {
  const sub = {
    id: _nextId++,
    name: data.name.trim(),
    price: Number(data.price),
    billingCycle: data.billingCycle,
    nextPayment: data.nextPayment,
    category: data.category || 'other',
    createdAt: new Date().toISOString(),
  };
  _store.push(sub);
  return _fake({ ...sub });
}

/**
 * PUT /api/subscriptions/:id
 */
export async function updateSubscription(id, data) {
  const idx = _store.findIndex(s => s.id === id);
  if (idx === -1) return { success: false, error: 'Subscription not found' };
  _store[idx] = {
    ..._store[idx],
    name: data.name.trim(),
    price: Number(data.price),
    billingCycle: data.billingCycle,
    nextPayment: data.nextPayment,
    category: data.category || 'other',
  };
  return _fake({ ..._store[idx] });
}

/**
 * DELETE /api/subscriptions/:id
 */
export async function deleteSubscription(id) {
  const idx = _store.findIndex(s => s.id === id);
  if (idx === -1) return { success: false, error: 'Subscription not found' };
  _store.splice(idx, 1);
  return _fake({ id });
}

/**
 * GET /api/subscriptions/summary/monthly
 */
export async function getMonthlySummary() {
  const total = _store.reduce((sum, s) => sum + toMonthly(s.price, s.billingCycle), 0);
  return _fake({
    totalMonthly: Number(total.toFixed(2)),
    count: _store.length,
  });
}

/**
 * GET /api/subscriptions/upcoming?days=N
 */
export async function getUpcoming(days = 7) {
  const upcoming = _store
    .map(s => ({ ...s, daysUntilPayment: daysUntil(s.nextPayment) }))
    .filter(s => s.daysUntilPayment >= 0 && s.daysUntilPayment <= days)
    .sort((a, b) => a.daysUntilPayment - b.daysUntilPayment);
  return _fake(upcoming);
}

/**
 * GET /api/subscriptions/stats
 */
export async function getStats() {
  const totalMonthly = _store.reduce((sum, s) => sum + toMonthly(s.price, s.billingCycle), 0);

  const categories = {};
  for (const s of _store) {
    if (!categories[s.category]) categories[s.category] = { count: 0, monthly: 0 };
    categories[s.category].count++;
    categories[s.category].monthly += toMonthly(s.price, s.billingCycle);
  }

  // Round category amounts
  for (const cat of Object.values(categories)) {
    cat.monthly = Number(cat.monthly.toFixed(2));
  }

  return _fake({
    totalMonthly: Number(totalMonthly.toFixed(2)),
    count: _store.length,
    categories,
  });
}
