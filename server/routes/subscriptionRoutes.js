/**
 * server/routes/subscriptionRoutes.js
 *
 * Maps URL patterns to controller methods.
 * No logic here — pure routing.
 *
 * CRITICAL ORDER:
 * Specific routes (/summary/monthly, /upcoming, /stats) MUST come
 * BEFORE the parameterized route (/:id) to avoid Express matching
 * them as IDs.
 */

'use strict';

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/subscriptionController');

// ── SPECIFIC ROUTES FIRST ────────────────────────────────────────────────────
router.get('/summary/monthly', ctrl.getMonthlySummary);
router.get('/upcoming',        ctrl.getUpcoming);
router.get('/stats',           ctrl.getStats);

// ── GENERIC CRUD ROUTES ──────────────────────────────────────────────────────
router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getById);
router.post('/',    ctrl.create);
router.put('/:id',  ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;