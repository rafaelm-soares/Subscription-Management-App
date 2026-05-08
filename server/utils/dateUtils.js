/**
 * server/utils/dateUtils.js
 * Date calculation helpers.
 */

/**
 * Returns the number of days from today until a given date string.
 * @param {string} dateStr — ISO date string 'YYYY-MM-DD'
 * @returns {number} days until that date (negative if in the past)
 */
function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

/**
 * Returns today's date as 'YYYY-MM-DD'.
 * @returns {string}
 */
function todayISO() {
  return new Date().toISOString().split('T')[0];
}

module.exports = { daysUntil, todayISO };
