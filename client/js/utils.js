/**
 * client/js/utils.js
 * Pure formatting and calculation helpers.
 * No DOM access. No API calls.
 */

/**
 * Formats a number as a currency string.
 * @param {number} amount
 * @param {string} currency - default 'EUR'
 * @returns {string} e.g. "€9.99"
 */
export function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Converts a price to its monthly equivalent.
 * @param {number} price
 * @param {'monthly'|'yearly'} billingCycle
 * @returns {number}
 */
export function toMonthly(price, billingCycle) {
  return billingCycle === 'yearly' ? price / 12 : price;
}

/**
 * Returns the number of days from today to a given date string.
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {number} - negative if in the past
 */
export function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

/**
 * Formats a date string for display.
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {string} e.g. "May 15, 2026"
 */
export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Returns today's date as 'YYYY-MM-DD'.
 * @returns {string}
 */
export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns initials from a service name (up to 2 chars).
 * @param {string} name
 * @returns {string} e.g. "NF" for "Netflix"
 */
export function initials(name) {
  return name.trim().slice(0, 2).toUpperCase();
}

/**
 * Returns a consistent background color for a service icon
 * based on the service name (deterministic, not random).
 * @param {string} name
 * @returns {string} CSS color string
 */
export function iconColor(name) {
  const COLORS = [
    { bg: 'rgba(240,165,0,0.15)',    fg: '#f0a500' },
    { bg: 'rgba(63,185,80,0.15)',    fg: '#3fb950' },
    { bg: 'rgba(88,166,255,0.15)',   fg: '#58a6ff' },
    { bg: 'rgba(188,140,255,0.15)',  fg: '#bc8cff' },
    { bg: 'rgba(248,81,73,0.15)',    fg: '#f85149' },
    { bg: 'rgba(255,166,87,0.15)',   fg: '#ffa657' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % COLORS.length;
  return COLORS[hash];
}

/**
 * Returns urgency class based on days until payment.
 * @param {number} days
 * @returns {'urgent'|'soon'|'ok'}
 */
export function urgencyClass(days) {
  if (days <= 2)  return 'urgent';
  if (days <= 7)  return 'soon';
  return 'ok';
}

/**
 * Returns a human-readable "days until" label.
 * @param {number} days
 * @returns {string}
 */
export function daysLabel(days) {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}
