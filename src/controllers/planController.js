const pool = require('../config/db');

// POST /api/plans (admin)
async function createPlan(req, res) {
  try {
    const { plan_name, duration_months, price, description } = req.body;
    if (!plan_name || !duration_months || price === undefined || price === '') {
      return res.status(400).json({ message: 'plan_name, duration_months and price are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO membership_plans (plan_name, duration_months, price, description) VALUES (?, ?, ?, ?)',
      [plan_name, duration_months, price, description || null]
    );
    res.status(201).json({ message: 'Plan created.', planId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create plan.', error: err.message });
  }
}

// GET /api/plans -> active plans + number of active members on each plan
async function getPlans(req, res) {
  try {
    const includeArchived = req.query.includeArchived === '1';
    const [rows] = await pool.query(
      `SELECT mp.id, mp.plan_name, mp.duration_months, mp.price, mp.description, mp.is_active,
              COUNT(m.id) AS enrolled
       FROM membership_plans mp
       LEFT JOIN members m ON m.plan_id = mp.id AND m.status = 'active'
       ${includeArchived ? '' : 'WHERE mp.is_active = 1'}
       GROUP BY mp.id
       ORDER BY mp.price ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plans.', error: err.message });
  }
}

// PUT /api/plans/:id (admin)
async function updatePlan(req, res) {
  try {
    const { plan_name, duration_months, price, description } = req.body;
    const [result] = await pool.query(
      'UPDATE membership_plans SET plan_name = ?, duration_months = ?, price = ?, description = ? WHERE id = ?',
      [plan_name, duration_months, price, description || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Plan not found.' });
    res.json({ message: 'Plan updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update plan.', error: err.message });
  }
}

// PUT /api/plans/:id/archive (admin) - hides plan from new sign-ups
async function archivePlan(req, res) {
  try {
    const [result] = await pool.query('UPDATE membership_plans SET is_active = 0 WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Plan not found.' });
    res.json({ message: 'Plan archived.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to archive plan.', error: err.message });
  }
}

module.exports = { createPlan, getPlans, updatePlan, archivePlan };