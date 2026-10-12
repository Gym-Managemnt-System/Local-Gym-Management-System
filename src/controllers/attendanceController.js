const pool = require('../config/db');

// Record member check-in
async function checkIn(req, res) {
  try {
    const { member_id } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toTimeString().split(' ')[0];

    await pool.query(
      `INSERT INTO attendance (member_id, check_in_date, check_in_time) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE check_in_time = VALUES(check_in_time)`,
      [member_id, today, now]
    );

    res.status(200).json({ message: "Check-in successful." });
  } catch (err) {
    res.status(500).json({ message: "Check-in failed.", error: err.message });
  }
}

// Fetch attendance for a specific member
async function getMemberAttendance(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM attendance WHERE member_id = ? ORDER BY check_in_date DESC, check_in_time DESC`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch member attendance.", error: err.message });
  }
}

// Overall attendance report
async function getAttendanceReport(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, u.full_name 
      FROM attendance a 
      JOIN members m ON a.member_id = m.id 
      JOIN users u ON m.user_id = u.id 
      ORDER BY a.check_in_date DESC 
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance report.", error: err.message });
  }
}

// Today's attendance across all members (for Attendance page table)
async function getTodayAttendance(req, res) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [rows] = await pool.query(`
      SELECT m.id AS member_id, u.full_name, mp.plan_name, a.check_in_time
      FROM members m
      JOIN users u ON m.user_id = u.id
      LEFT JOIN membership_plans mp ON m.plan_id = mp.id
      LEFT JOIN attendance a ON a.member_id = m.id AND a.check_in_date = ?
      WHERE m.status != 'deactivated'
      ORDER BY u.full_name ASC
    `, [today]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch today's attendance.", error: err.message });
  }
}

module.exports = { checkIn, getMemberAttendance, getAttendanceReport, getTodayAttendance };