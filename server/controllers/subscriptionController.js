/**
 * server/controllers/subscriptionController.js
 *
 * Handles HTTP request/response for all subscription endpoints.
 * Responsibilities:
 *   - Parse and type-cast req.params / req.query / req.body
 *   - Call the appropriate service method
 *   - Format the standard { success, data } or { success, error } response
 *   - Catch errors thrown by the service and map them to HTTP status codes
 *
 * No business logic here. No DB access here.
 */

'use strict';

const service = require('../services/subscriptionService');

// ── RESPONSE HELPERS ──────────────────────────────────────────────────────────
function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function fail(res, message, status = 500) {
  return res.status(status).json({ success: false, error: message });
}

// ── CONTROLLER ────────────────────────────────────────────────────────────────
const subscriptionController = {

  /**
   * GET /api/subscriptions
   */
  getAll(req, res) {
    try {
      const data = service.getAll();
      ok(res, data);
    } catch (err) {
      fail(res, err.message, err.status || 500);
    }
  },

  /**
   * GET /api/subscriptions/:id
   */
  getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id < 1) return fail(res, 'Invalid id parameter', 400);
      const data = service.getById(id);
      ok(res, data);
    } catch (err) {
      fail(res, err.message, err.status || 500);
    }
  },

  /**
   * POST /api/subscriptions
   */
  create(req, res) {
    try {
      const data = service.create(req.body);
      ok(res, data, 201);
    } catch (err) {
      fail(res, err.message, err.status || 500);
    }
  },

  /**
   * PUT /api/subscriptions/:id
   */
  update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id < 1) return fail(res, 'Invalid id parameter', 400);
      const data = service.update(id, req.body);
      ok(res, data);
    } catch (err) {
      fail(res, err.message, err.status || 500);
    }
  },

  /**
   * DELETE /api/subscriptions/:id
   */
  delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id < 1) return fail(res, 'Invalid id parameter', 400);
      service.delete(id);
      ok(res, { id });
    } catch (err) {
      fail(res, err.message, err.status || 500);
    }
  },

  /**
   * GET /api/subscriptions/summary/monthly
   */
  getMonthlySummary(req, res) {
    try {
      const data = service.getMonthlySummary();
      ok(res, data);
    } catch (err) {
      fail(res, err.message, err.status || 500);
    }
  },

  /**
   * GET /api/subscriptions/upcoming?days=7
   */
  getUpcoming(req, res) {
    try {
      const days = parseInt(req.query.days, 10) || 7;
      const data = service.getUpcoming(days);
      ok(res, data);
    } catch (err) {
      fail(res, err.message, err.status || 500);
    }
  },

  /**
   * GET /api/subscriptions/stats
   */
  getStats(req, res) {
    try {
      const data = service.getStats();
      ok(res, data);
    } catch (err) {
      fail(res, err.message, err.status || 500);
    }
  },

};

module.exports = subscriptionController;