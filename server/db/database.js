/**
 * server/db/database.js
 *
 * Opens (or creates) the SQLite database using sql.js.
 * sql.js is pure JavaScript — no native compilation required.
 *
 * Persistence strategy:
 *   - On startup: load DB from file if it exists, otherwise create fresh.
 *   - On every write: export and save the binary to disk.
 *   - The save() function is called by the repository after every mutation.
 */

'use strict';

const initSqlJs = require('sql.js');
const fs        = require('fs');
const path      = require('path');

const DB_PATH = path.join(__dirname, '../../subtrack.db');

// Module-level references — set once during init()
let _SQL = null;
let _db  = null;

/**
 * Initializes the database.
 * Must be called (and awaited) once at server startup before any queries.
 * @returns {Promise<void>}
 */
async function init() {
  _SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    _db = new _SQL.Database(fileBuffer);
    console.log('[DB] Loaded existing database from', DB_PATH);
  } else {
    _db = new _SQL.Database();
    console.log('[DB] Created new in-memory database');
  }
}

/**
 * Returns the active database instance.
 * Throws if init() has not been called yet.
 * @returns {Database}
 */
function getDb() {
  if (!_db) throw new Error('[DB] Database not initialized. Call init() first.');
  return _db;
}

/**
 * Persists the current in-memory database state to disk.
 * Call after every INSERT, UPDATE, or DELETE.
 */
function save() {
  if (!_db) return;
  const data = _db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = { init, getDb, save };