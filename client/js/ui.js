/**
 * client/js/ui.js
 * All DOM rendering functions.
 * No business logic. No API calls.
 * Takes data in, writes HTML out.
 */

import {
  formatCurrency, formatDate, daysUntil,
  initials, iconColor, urgencyClass, daysLabel, toMonthly
} from './utils.js';

// ── ICON HELPER ──────────────────────────────────────────────────────────────
function renderIcon(name, size = 34) {
  const { bg, fg } = iconColor(name);
  return `<div class="sub-list-item__icon" style="width:${size}px;height:${size}px;background:${bg};color:${fg}">
    ${initials(name)}
  </div>`;
}

function renderTableIcon(name) {
  const { bg, fg } = iconColor(name);
  return `<div class="td-icon" style="background:${bg};color:${fg}">${initials(name)}</div>`;
}

// ── BADGE ────────────────────────────────────────────────────────────────────
function renderBadge(category) {
  const labels = {
    entertainment: 'Entertainment',
    fitness: 'Fitness',
    software: 'Software',
    other: 'Other',
  };
  return `<span class="badge badge--${category}">${labels[category] || category}</span>`;
}

// ── STAT CARDS ───────────────────────────────────────────────────────────────
/**
 * Updates all dashboard stat card values.
 * @param {Object} stats - { totalMonthly, count, categories }
 * @param {number} dueThisWeek - count of upcoming payments in 7 days
 */
export function renderStats(stats, dueThisWeek) {
  const monthly = stats.totalMonthly || 0;
  const count   = stats.count || 0;
  const avg     = count > 0 ? monthly / count : 0;

  document.getElementById('stat-monthly').textContent    = formatCurrency(monthly);
  document.getElementById('stat-annual').textContent     = formatCurrency(monthly * 12);
  document.getElementById('stat-subs-count').textContent = `${count} active subscription${count !== 1 ? 's' : ''}`;
  document.getElementById('stat-due-week').textContent   = dueThisWeek;
  document.getElementById('stat-avg').textContent        = formatCurrency(avg);
}

// ── ALERT STRIP ──────────────────────────────────────────────────────────────
/**
 * Shows/hides the upcoming payments alert banner.
 * @param {Array} upcoming - list of subscriptions due soon
 */
export function renderAlertStrip(upcoming) {
  const el = document.getElementById('alert-strip');
  const txt = document.getElementById('alert-strip-text');
  if (!upcoming || upcoming.length === 0) {
    el.style.display = 'none';
    return;
  }
  el.style.display = 'flex';
  const todayCount = upcoming.filter(s => s.daysUntilPayment === 0).length;
  if (todayCount > 0) {
    txt.textContent = `${todayCount} payment${todayCount > 1 ? 's' : ''} due today!`;
  } else {
    const next = upcoming[0];
    txt.textContent = `${next.name} is due ${daysLabel(next.daysUntilPayment).toLowerCase()} (${formatCurrency(next.price)})`;
  }
}

// ── DASHBOARD SUB LIST ───────────────────────────────────────────────────────
/**
 * Renders the compact subscription list on the dashboard.
 * @param {Array} subscriptions
 */
export function renderDashboardList(subscriptions) {
  const list  = document.getElementById('dashboard-sub-list');
  const empty = document.getElementById('dashboard-empty');

  if (!subscriptions || subscriptions.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }

  empty.style.display = 'none';
  list.innerHTML = subscriptions.map(s => {
    const monthly = toMonthly(s.price, s.billingCycle);
    const days    = daysUntil(s.nextPayment);
    const datePillClass = days <= 2 ? 'urgent' : days <= 7 ? 'soon' : '';
    return `
      <div class="sub-list-item">
        ${renderIcon(s.name)}
        <div class="sub-list-item__info">
          <div class="sub-list-item__name">${s.name}</div>
          <div class="sub-list-item__meta">${renderBadge(s.category)}</div>
        </div>
        <div>
          <div class="sub-list-item__price">${formatCurrency(monthly)}<span style="color:var(--text-muted);font-size:10px">/mo</span></div>
          ${datePillClass ? `<div class="date-pill date-pill--${datePillClass}" style="margin-top:4px;justify-content:flex-end">${daysLabel(days)}</div>` : ''}
        </div>
      </div>`;
  }).join('');
}

// ── CATEGORY BREAKDOWN ───────────────────────────────────────────────────────
const CAT_COLORS = {
  entertainment: 'var(--cat-entertainment)',
  fitness:       'var(--cat-fitness)',
  software:      'var(--cat-software)',
  other:         'var(--cat-other)',
};

/**
 * Renders the category breakdown panel.
 * @param {Object} categories - { entertainment: { count, monthly }, ... }
 * @param {number} totalMonthly
 */
export function renderCategories(categories, totalMonthly) {
  const list  = document.getElementById('category-list');
  const empty = document.getElementById('category-empty');

  if (!categories || Object.keys(categories).length === 0) {
    list.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }

  empty.style.display = 'none';
  const entries = Object.entries(categories).sort((a, b) => b[1].monthly - a[1].monthly);

  list.innerHTML = entries.map(([cat, data]) => {
    const pct   = totalMonthly > 0 ? (data.monthly / totalMonthly) * 100 : 0;
    const color = CAT_COLORS[cat] || 'var(--cat-other)';
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    return `
      <div class="category-item">
        <div class="category-item__dot" style="background:${color}"></div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span class="category-item__name">${label}</span>
            <span class="category-item__count">${data.count} sub${data.count !== 1 ? 's' : ''}</span>
            <span class="category-item__amount" style="color:${color}">${formatCurrency(data.monthly)}<span style="color:var(--text-muted);font-size:10px">/mo</span></span>
          </div>
          <div class="category-item__bar-wrap">
            <div class="category-item__bar" style="width:${pct.toFixed(1)}%;background:${color}"></div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ── SUBSCRIPTIONS TABLE ──────────────────────────────────────────────────────
/**
 * Renders the full subscriptions table.
 * @param {Array} subscriptions
 * @param {Function} onEdit   - callback(id)
 * @param {Function} onDelete - callback(id, name)
 */
export function renderTable(subscriptions, onEdit, onDelete) {
  const body  = document.getElementById('sub-table-body');
  const empty = document.getElementById('subs-empty');

  if (!subscriptions || subscriptions.length === 0) {
    body.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }

  empty.style.display = 'none';
  body.innerHTML = subscriptions.map(s => {
    const monthly = toMonthly(s.price, s.billingCycle);
    const days    = daysUntil(s.nextPayment);
    const urgency = days <= 7 ? (days <= 2 ? 'urgent' : 'soon') : '';

    return `
      <tr data-id="${s.id}">
        <td class="td-name">
          ${renderTableIcon(s.name)}
          ${s.name}
        </td>
        <td>${renderBadge(s.category)}</td>
        <td class="td-price">${formatCurrency(s.price)}</td>
        <td><span style="color:var(--text-muted);font-size:12px">${s.billingCycle}</span></td>
        <td>
          <span class="date-pill ${urgency ? `date-pill--${urgency}` : ''}">
            ${formatDate(s.nextPayment)}
          </span>
        </td>
        <td class="td-monthly">${formatCurrency(monthly)}<span style="color:var(--text-muted);font-size:10px">/mo</span></td>
        <td>
          <div class="td-actions">
            <button class="btn-icon" data-action="edit" data-id="${s.id}" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon btn-icon--danger" data-action="delete" data-id="${s.id}" data-name="${s.name}" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');

  // Wire action buttons
  body.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => onEdit(Number(btn.dataset.id)));
  });
  body.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => onDelete(Number(btn.dataset.id), btn.dataset.name));
  });
}

// ── UPCOMING LIST ────────────────────────────────────────────────────────────
/**
 * Renders the upcoming payments view.
 * @param {Array} upcoming - subscriptions with daysUntilPayment field
 */
export function renderUpcoming(upcoming) {
  const list  = document.getElementById('upcoming-list');
  const empty = document.getElementById('upcoming-empty');

  if (!upcoming || upcoming.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }

  empty.style.display = 'none';
  list.innerHTML = upcoming.map(s => {
    const days    = s.daysUntilPayment;
    const urgency = urgencyClass(days);
    const { bg, fg } = iconColor(s.name);
    return `
      <div class="upcoming-card upcoming-card--${urgency}">
        <div class="upcoming-card__icon" style="background:${bg};color:${fg};width:42px;height:42px">
          ${initials(s.name)}
        </div>
        <div class="upcoming-card__info">
          <div class="upcoming-card__name">${s.name}</div>
          <div class="upcoming-card__date">${formatDate(s.nextPayment)} · ${s.billingCycle}</div>
        </div>
        <div class="upcoming-card__days">
          <div class="upcoming-card__days-number" style="color:${urgency === 'urgent' ? 'var(--red)' : urgency === 'soon' ? 'var(--accent)' : 'var(--green)'}">
            ${days}
          </div>
          <div class="upcoming-card__days-label">day${days !== 1 ? 's' : ''} left</div>
        </div>
        <div class="upcoming-card__price" style="color:var(--text-primary)">
          ${formatCurrency(s.price)}
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${s.billingCycle}</div>
        </div>
      </div>`;
  }).join('');
}

// ── TOAST ────────────────────────────────────────────────────────────────────
let _toastTimer = null;

/**
 * Shows a transient toast notification.
 * @param {string} message
 * @param {'success'|'error'|''} type
 */
export function showToast(message, type = '') {
  const el = document.getElementById('toast');
  el.textContent  = message;
  el.className    = `toast${type ? ` toast--${type}` : ''} show`;
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.classList.remove('show'); }, 3000);
}
