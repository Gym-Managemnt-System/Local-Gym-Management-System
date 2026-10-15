const pool = require('../config/db');

// FR-6: Record a payment
async function createPayment(req, res) {
  try {
    const { member_id, amount, payment_date, payment_method, status } = req.body;
    const [result] = await pool.query(
      `INSERT INTO payments (member_id, amount, payment_date, payment_method, status)
       VALUES (?, ?, ?, ?, ?)`,
      [member_id, amount, payment_date, payment_method, status || 'paid']
    );
    res.status(201).json({ message: 'Payment recorded.', paymentId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record payment.', error: err.message });
  }
}

// FR-6: Payment history for one member
async function getMemberPayments(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE member_id = ? ORDER BY payment_date DESC',
      [req.params.memberId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments.', error: err.message });
  }
}

// FR-7: Admin payments report
async function getPaymentsReport(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT u.full_name, SUM(p.amount) AS total_paid, COUNT(p.id) AS transactions
      FROM payments p
      JOIN members m ON p.member_id = m.id
      JOIN users u ON m.user_id = u.id
      WHERE p.status = 'paid'
      GROUP BY m.id, u.full_name
      ORDER BY total_paid DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate report.', error: err.message });
  }
}

module.exports = { createPayment, getMemberPayments, getPaymentsReport };
