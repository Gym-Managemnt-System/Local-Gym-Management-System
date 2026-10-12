const pool = require('../config/db');

// FR-6: Record a payment
async function createPayment(req, res) {
  try {
    const { member_id, amount, payment_date, payment_method } = req.body;
    const status = (req.body.status || 'paid').toLowerCase().trim();
    const [result] = await pool.query(
      `INSERT INTO payments (member_id, amount, payment_date, payment_method, status)
       VALUES (?, ?, ?, ?, ?)`,
      [member_id, amount, payment_date, payment_method, status]
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

// FR-6: All payments (Admin Dashboard)
async function getAllPayments(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id, p.amount, p.payment_date, p.payment_method, p.status,
        m.id AS member_id, u.full_name,
        mp.plan_name, mp.duration_months
      FROM payments p
      JOIN members m ON p.member_id = m.id
      JOIN users u ON m.user_id = u.id
      LEFT JOIN membership_plans mp ON m.plan_id = mp.id
      ORDER BY p.payment_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all payments.', error: err.message });
  }
}

async function updatePayment(req, res) {
  try {
    const { amount, payment_date, payment_method } = req.body;
    const status = (req.body.status || 'paid').toLowerCase().trim();
    await pool.query(
      'UPDATE payments SET amount=?, payment_date=?, payment_method=?, status=? WHERE id=?',
      [amount, payment_date, payment_method, status, req.params.id]
    );
    res.json({ message: 'Payment updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update payment.', error: err.message });
  }
}

async function deletePayment(req, res) {
  try {
    await pool.query('DELETE FROM payments WHERE id=?', [req.params.id]);
    res.json({ message: 'Payment deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete payment.', error: err.message });
  }
}

async function getPaymentById(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM payments WHERE id=?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Payment not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payment.', error: err.message });
  }
}

module.exports = { createPayment, getMemberPayments, getPaymentsReport, getAllPayments, updatePayment, deletePayment, getPaymentById };
