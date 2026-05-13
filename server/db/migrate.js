/**
 * server/db/migrate.js
 *
 * Creates the subscriptions table if it does not already exist.
 * Safe to run on every startup (idempotent via IF NOT EXISTS).
 * Called once after database.init() in server.js.
 */

'use strict';

const { getDb, save } = require('./database');

function migrate() {
  const db = getDb();

  db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL,
      price        REAL    NOT NULL,
      billingCycle TEXT    NOT NULL CHECK(billingCycle IN ('monthly', 'yearly')),
      nextPayment  TEXT    NOT NULL,
      category     TEXT    NOT NULL DEFAULT 'other',
      createdAt    TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Persist the schema change (no-op if table already existed)
  save();

  console.log('[DB] Migration complete — subscriptions table ready');
}

module.exports = migrate;