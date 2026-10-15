const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// FR-1/FR-2: Admin registers a new member (creates user + member in one transaction)
async function registerMember(req, res) {
  const connection = await pool.getConnection();
  try {
    const { full_name, email, password, plan_name, membership_start, membership_end, phone, dob, gender, address, username } = req.body;

    if (!full_name || !email || !password || !plan_name) {
      connection.release();
      return res.status(400).json({ message: 'full_name, email, password and plan_name are required.' });
    }

    await connection.beginTransaction();

    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const [[plan]] = await connection.query(
      'SELECT id, duration_months FROM membership_plans WHERE LOWER(plan_name) = LOWER(?)',
      [plan_name]
    );
    if (!plan) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ message: `Plan "${plan_name}" not found.` });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      `INSERT INTO users (full_name, email, password_hash, role, username, phone, dob, gender, address, plan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, password_hash, 'member', username || null, phone || null, dob || null, gender || null, address || null, plan_name]
    );
    const userId = userResult.insertId;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + plan.duration_months);

    const joinDate = startDate.toISOString().slice(0, 10);
    const calculatedEnd = endDate.toISOString().slice(0, 10);

    const [memberResult] = await connection.query(
      `INSERT INTO members (user_id, plan_id, join_date, membership_start, membership_end, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [userId, plan.id, joinDate, membership_start || joinDate, membership_end || calculatedEnd]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Member registered successfully.',
      userId,
      memberId: memberResult.insertId
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    res.status(500).json({ message: 'Failed to register member.', error: err.message });
  }
}

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

// FR-8: Logged-in member views their own profile
async function getMyProfile(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT m.*, u.full_name, u.email, mp.plan_name, mp.price, mp.duration_months
       FROM members m
       JOIN users u ON m.user_id = u.id
       LEFT JOIN membership_plans mp ON m.plan_id = mp.id
       WHERE m.user_id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Member profile not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.', error: err.message });
  }
}

// FR-1: Update member details / renew plan
async function updateMember(req, res) {
  try {
    const { plan_id, plan_name, membership_start, membership_end, status } = req.body;

    let resolvedPlanId = plan_id;

    if (!resolvedPlanId && plan_name) {
      const [[plan]] = await pool.query(
        'SELECT id FROM membership_plans WHERE LOWER(plan_name) = LOWER(?)',
        [plan_name]
      );
      if (!plan) {
        return res.status(400).json({ message: `Plan "${plan_name}" not found.` });
      }
      resolvedPlanId = plan.id;
    }

    await pool.query(
      `UPDATE members SET plan_id = ?, membership_start = ?, membership_end = ?, status = ? WHERE id = ?`,
      [resolvedPlanId, membership_start, membership_end, status, req.params.id]
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

// FR-1: Permanently delete a member (cascades to user account via FK)
async function deleteMember(req, res) {
  try {
    const [[member]] = await pool.query('SELECT user_id FROM members WHERE id = ?', [req.params.id]);
    if (!member) return res.status(404).json({ message: 'Member not found.' });

    await pool.query('DELETE FROM users WHERE id = ?', [member.user_id]);
    res.json({ message: 'Member deleted permanently.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete member.', error: err.message });
  }
}

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deactivateMember,
  registerMember,
  deleteMember,
  getMyProfile
};