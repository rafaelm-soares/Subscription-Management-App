/**
 * server/services/subscriptionService.js
 *
 * All business logic for subscriptions:
 *   - Monthly cost normalization (yearly ÷ 12)
 *   - Upcoming payment enrichment (daysUntilPayment field)
 *   - Stats / category aggregation
 *   - Input validation before hitting the repository
 *
 * This layer never touches Express (req/res) directly.
 * It receives plain data and returns plain data.
 */

'use strict';

const repo         = require('../repositories/subscriptionRepository');
const { toMonthly } = require('../utils/mathUtils');
const { daysUntil } = require('../utils/dateUtils');

// ── VALIDATION ────────────────────────────────────────────────────────────────
const VALID_CYCLES     = ['monthly', 'yearly'];
const VALID_CATEGORIES = ['entertainment', 'fitness', 'software', 'other'];

/**
 * Validates and sanitizes subscription input data.
 * @param {Object} data - raw input from controller
 * @returns {{ valid: boolean, errors: string[], cleaned: Object }}
 */
function validateInput(data) {
  const errors  = [];
  const cleaned = {};

  // name
  const name = (data.name || '').toString().trim();
  if (!name) {
    errors.push('name is required');
  } else {
    cleaned.name = name;
  }

  // price
  const price = Number(data.price);
  if (!data.price || isNaN(price) || price <= 0) {
    errors.push('price must be a number greater than 0');
  } else {
    cleaned.price = price;
  }

  // billingCycle
  const billingCycle = (data.billingCycle || '').toString().trim();
  if (!VALID_CYCLES.includes(billingCycle)) {
    errors.push(`billingCycle must be one of: ${VALID_CYCLES.join(', ')}`);
  } else {
    cleaned.billingCycle = billingCycle;
  }

  // nextPayment
  const nextPayment = (data.nextPayment || '').toString().trim();
  if (!nextPayment || isNaN(new Date(nextPayment).getTime())) {
    errors.push('nextPayment must be a valid date (YYYY-MM-DD)');
  } else {
    cleaned.nextPayment = nextPayment;
  }

  // category (optional — defaults to 'other')
  const cat = (data.category || 'other').toString().trim().toLowerCase();
  cleaned.category = VALID_CATEGORIES.includes(cat) ? cat : 'other';

  return {
    valid: errors.length === 0,
    errors,
    cleaned,
  };
}

// ── SERVICE ───────────────────────────────────────────────────────────────────
const subscriptionService = {

  /**
   * Returns all subscriptions.
   * @returns {Array<Object>}
   */
  getAll() {
    return repo.findAll();
  },

  /**
   * Returns a single subscription or throws if not found.
   * @param {number} id
   * @returns {Object}
   */
  getById(id) {
    const sub = repo.findById(id);
    if (!sub) {
      const err = new Error('Subscription not found');
      err.status = 404;
      throw err;
    }
    return sub;
  },

  /**
   * Validates input and creates a new subscription.
   * @param {Object} data - raw request body
   * @returns {Object} created subscription
   */
  create(data) {
    const { valid, errors, cleaned } = validateInput(data);
    if (!valid) {
      const err = new Error(errors.join('; '));
      err.status = 400;
      throw err;
    }
    return repo.create(cleaned);
  },

  /**
   * Validates input and updates an existing subscription.
   * @param {number} id
   * @param {Object} data - raw request body
   * @returns {Object} updated subscription
   */
  update(id, data) {
    // Ensure the subscription exists first
    this.getById(id);

    const { valid, errors, cleaned } = validateInput(data);
    if (!valid) {
      const err = new Error(errors.join('; '));
      err.status = 400;
      throw err;
    }
    return repo.update(id, cleaned);
  },

  /**
   * Deletes a subscription by ID.
   * @param {number} id
   */
  delete(id) {
    const deleted = repo.delete(id);
    if (!deleted) {
      const err = new Error('Subscription not found');
      err.status = 404;
      throw err;
    }
  },

  /**
   * Calculates the total monthly spend across all subscriptions.
   * Yearly prices are normalized to monthly (price ÷ 12).
   * @returns {{ totalMonthly: number, count: number }}
   */
  getMonthlySummary() {
    const subs         = repo.findAll();
    const totalMonthly = subs.reduce(
      (sum, s) => sum + toMonthly(s.price, s.billingCycle),
      0
    );
    return {
      totalMonthly: Number(totalMonthly.toFixed(2)),
      count: subs.length,
    };
  },

  /**
   * Returns subscriptions with a payment due within the next N days.
   * Enriches each subscription with a daysUntilPayment field.
   * @param {number} days - lookahead window (default 7, max 365)
   * @returns {Array<Object>}
   */
  getUpcoming(days = 7) {
    const safeDays = Math.min(Math.max(1, Number(days) || 7), 365);
    return repo
      .findUpcoming(safeDays)
      .map(s => ({ ...s, daysUntilPayment: daysUntil(s.nextPayment) }));
  },

  /**
   * Returns aggregated stats: total monthly cost + per-category breakdown.
   * @returns {{ totalMonthly: number, count: number, categories: Object }}
   */
  getStats() {
    const subs         = repo.findAll();
    const totalMonthly = subs.reduce(
      (sum, s) => sum + toMonthly(s.price, s.billingCycle),
      0
    );

    const categories = {};
    for (const s of subs) {
      const cat = s.category || 'other';
      if (!categories[cat]) categories[cat] = { count: 0, monthly: 0 };
      categories[cat].count++;
      categories[cat].monthly += toMonthly(s.price, s.billingCycle);
    }

    // Round all category monthlies
    for (const cat of Object.values(categories)) {
      cat.monthly = Number(cat.monthly.toFixed(2));
    }

    return {
      totalMonthly: Number(totalMonthly.toFixed(2)),
      count: subs.length,
      categories,
    };
  },

};

module.exports = subscriptionService;