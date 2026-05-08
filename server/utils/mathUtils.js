/**
 * server/utils/mathUtils.js
 * Price normalization helpers.
 */

/**
 * Converts a price to its monthly equivalent.
 * @param {number} price
 * @param {'monthly'|'yearly'} billingCycle
 * @returns {number} monthly price
 */
function toMonthly(price, billingCycle) {
  return billingCycle === 'yearly' ? price / 12 : price;
}

module.exports = { toMonthly };
