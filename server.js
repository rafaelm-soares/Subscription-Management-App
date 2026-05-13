/**
 * server.js — SubTrack entry point
 *
 * Initialization sequence:
 *   1. Initialize sql.js database (async)
 *   2. Run migrations (create tables)
 *   3. Wire up Express middleware and routes
 *   4. Start listening
 *
 * The database MUST be initialized before any route handlers can run,
 * so we use an async IIFE to orchestrate startup.
 */

'use strict';

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const { init: initDb } = require('./server/db/database');
const migrate          = require('./server/db/migrate');
const subscriptionRoutes = require('./server/routes/subscriptionRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// ── STATIC FILES (frontend) ───────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'client')));

// ── API ROUTES ────────────────────────────────────────────────────────────────
app.use('/api/subscriptions', subscriptionRoutes);

// ── CATCH-ALL: serve index.html for any non-API route ────────────────────────
// Must come AFTER /api routes so it doesn't swallow them
app.get('*', (req, res) => {
  // Only serve index.html if it's not an API path that 404'd
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'client', 'index.html'));
  }
  // If it's an API path that got here, it's a 404
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// ── ERROR HANDLER (catch-all for unhandled errors) ────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ── ASYNC STARTUP ─────────────────────────────────────────────────────────────
(async () => {
  try {
    console.log('[SERVER] Initializing database...');
    await initDb();

    console.log('[SERVER] Running migrations...');
    migrate();

    console.log('[SERVER] Starting Express...');
    app.listen(PORT, () => {
      console.log(`\n✓ SubTrack running at http://localhost:${PORT}`);
      console.log('✓ Database ready');
      console.log('✓ Press Ctrl+C to stop\n');
    });
  } catch (err) {
    console.error('[FATAL] Failed to start server:', err);
    process.exit(1);
  }
})();