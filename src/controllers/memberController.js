const pool = require('../config/db');

// FR-1: Register a member (admin action, links to an existing user account)
async function createMember(req, res) {
  try {
    const { user_id, plan_id, join_date, membership_start, membership_end } = req.body;
    const [result] = await pool.query(
      `INSERT INTO members (user_id, plan_id, join_date, membership_start, membership_end, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [user_id, plan_id, join_date, membership_start, membership_end]
    );
    res.status(201).json({ message: 'Member created.', memberId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create member.', error: err.message });
  }
}

// FR-1: List / search members
async function getMembers(req, res) {
  try {
    const { search } = req.query;
    let query = `
      SELECT m.id, u.full_name, u.email, mp.plan_name, m.status, m.membership_start, m.membership_end
      FROM members m
      JOIN users u ON m.user_id = u.id
      LEFT JOIN membership_plans mp ON m.plan_id = mp.id
    `;
    const params = [];
    if (search) {
      query += ' WHERE u.full_name LIKE ? OR u.email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch members.', error: err.message });
  }
}

// FR-8: Get a single member's profile + membership status
async function getMemberById(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT m.*, u.full_name, u.email, mp.plan_name, mp.price
       FROM members m
       JOIN users u ON m.user_id = u.id
       LEFT JOIN membership_plans mp ON m.plan_id = mp.id
       WHERE m.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Member not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch member.', error: err.message });
  }
}

// FR-1: Update member details / renew plan
async function updateMember(req, res) {
  try {
    const { plan_id, membership_start, membership_end, status } = req.body;
    await pool.query(
      `UPDATE members SET plan_id = ?, membership_start = ?, membership_end = ?, status = ? WHERE id = ?`,
      [plan_id, membership_start, membership_end, status, req.params.id]
    );
    res.json({ message: 'Member updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update member.', error: err.message });
  }
}

// FR-1: Deactivate a member (soft delete)
async function deactivateMember(req, res) {
  try {
    await pool.query(`UPDATE members SET status = 'deactivated' WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Member deactivated.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to deactivate member.', error: err.message });
  }
}

module.exports = { createMember, getMembers, getMemberById, updateMember, deactivateMember };
