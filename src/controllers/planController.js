const pool = require('../config/db');

// FR-3: Membership plan management
async function createPlan(req, res) {
  try {
    const { plan_name, duration_months, price, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO membership_plans (plan_name, duration_months, price, description) VALUES (?, ?, ?, ?)',
      [plan_name, duration_months, price, description]
    );
    res.status(201).json({ message: 'Plan created.', planId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create plan.', error: err.message });
  }
}

async function getPlans(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM membership_plans');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plans.', error: err.message });
  }
}

module.exports = { createPlan, getPlans };
