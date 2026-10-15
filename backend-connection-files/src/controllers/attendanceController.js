const pool = require('../config/db');

// FR-4: Record daily check-in
async function checkIn(req, res) {
  try {
    const { member_id } = req.body;
    const now = new Date();
    const check_in_date = now.toISOString().slice(0, 10);
    const check_in_time = now.toTimeString().slice(0, 8);

    await pool.query(
      'INSERT INTO attendance (member_id, check_in_date, check_in_time) VALUES (?, ?, ?)',
      [member_id, check_in_date, check_in_time]
    );
    res.status(201).json({ message: 'Attendance recorded.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record attendance.', error: err.message });
  }
}

// FR-4 / FR-7: Attendance history for one member
async function getMemberAttendance(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM attendance WHERE member_id = ? ORDER BY check_in_date DESC',
      [req.params.memberId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance.', error: err.message });
  }
}

// FR-7: Admin attendance report across all members
async function getAttendanceReport(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT u.full_name, COUNT(a.id) AS total_check_ins
      FROM attendance a
      JOIN members m ON a.member_id = m.id
      JOIN users u ON m.user_id = u.id
      GROUP BY m.id, u.full_name
      ORDER BY total_check_ins DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate report.', error: err.message });
  }
}

module.exports = { checkIn, getMemberAttendance, getAttendanceReport };
