/**
 * server/repositories/subscriptionRepository.js
 *
 * All direct SQLite queries for the subscriptions table.
 * Returns plain JS objects — no business logic here.
 *
 * sql.js query patterns used:
 *   db.exec(sql)           → [{ columns, values }]  — for SELECT (no params)
 *   db.run(sql, params)    → void                   — for INSERT/UPDATE/DELETE
 *   db.prepare(sql)        → Statement              — for SELECT with params
 *   stmt.getAsObject()     → plain object           — single row by column name
 *   db.exec("SELECT last_insert_rowid()") → get new id after INSERT
 */

'use strict';

const { getDb, save } = require('../db/database');

// ── HELPER ────────────────────────────────────────────────────────────────────
/**
 * Converts a sql.js exec() result into an array of plain objects.
 * @param {Array} result - sql.js exec() return value
 * @returns {Array<Object>}
 */
function toObjects(result) {
  if (!result || result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

// ── REPOSITORY ────────────────────────────────────────────────────────────────
const subscriptionRepository = {

  /**
   * Returns all subscriptions ordered by nextPayment ascending.
   * @returns {Array<Object>}
   */
  findAll() {
    const db = getDb();
    return toObjects(db.exec('SELECT * FROM subscriptions ORDER BY nextPayment ASC'));
  },

  /**
   * Returns a single subscription by ID, or null if not found.
   * @param {number} id
   * @returns {Object|null}
   */
  findById(id) {
    const db   = getDb();
    const stmt = db.prepare('SELECT * FROM subscriptions WHERE id = ?');
    stmt.bind([id]);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  },

  /**
   * Inserts a new subscription and returns the full created record.
   * @param {{ name, price, billingCycle, nextPayment, category }} data
   * @returns {Object}
   */
  create(data) {
    const db = getDb();
    db.run(
      `INSERT INTO subscriptions (name, price, billingCycle, nextPayment, category)
       VALUES (?, ?, ?, ?, ?)`,
      [data.name, data.price, data.billingCycle, data.nextPayment, data.category]
    );
    const idResult = db.exec('SELECT last_insert_rowid()');
    const newId    = idResult[0].values[0][0];
    save();
    return this.findById(newId);
  },

  /**
   * Updates an existing subscription and returns the updated record.
   * Returns null if the ID does not exist.
   * @param {number} id
   * @param {{ name, price, billingCycle, nextPayment, category }} data
   * @returns {Object|null}
   */
  update(id, data) {
    const db = getDb();
    db.run(
      `UPDATE subscriptions
       SET name = ?, price = ?, billingCycle = ?, nextPayment = ?, category = ?
       WHERE id = ?`,
      [data.name, data.price, data.billingCycle, data.nextPayment, data.category, id]
    );
    save();
    return this.findById(id);
  },

  /**
   * Deletes a subscription by ID.
   * @param {number} id
   * @returns {boolean} true if a row was deleted, false if not found
   */
  delete(id) {
    const db = getDb();
    // Check existence first so we can report not-found accurately
    const existing = this.findById(id);
    if (!existing) return false;
    db.run('DELETE FROM subscriptions WHERE id = ?', [id]);
    save();
    return true;
  },

  /**
   * Returns all subscriptions whose nextPayment is between today
   * and today + days (inclusive), ordered by nextPayment ascending.
   * @param {number} days
   * @returns {Array<Object>}
   */
  findUpcoming(days) {
    const db = getDb();
    return toObjects(db.exec(
      `SELECT * FROM subscriptions
       WHERE nextPayment >= date('now')
         AND nextPayment <= date('now', '+${Math.floor(days)} days')
       ORDER BY nextPayment ASC`
    ));
  },

};

module.exports = subscriptionRepository;