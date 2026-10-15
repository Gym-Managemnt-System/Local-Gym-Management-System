const pool = require('../config/db');

// GET /api/dashboard/stats
async function getDashboardStats(req, res) {
  try {
    // 1. Live Stat Cards
    const [[{ active_members }]] = await pool.query(
      "SELECT COUNT(*) AS active_members FROM members WHERE status = 'active'"
    );

    const [[{ checked_in_today }]] = await pool.query(
      "SELECT COUNT(*) AS checked_in_today FROM attendance WHERE check_in_date = CURDATE()"
    );

    const [[{ revenue_this_month }]] = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) AS revenue_this_month FROM payments WHERE status = 'paid' AND MONTH(payment_date) = MONTH(CURDATE()) AND YEAR(payment_date) = YEAR(CURDATE())"
    );

    const [[{ total_revenue }]] = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM payments WHERE status = 'paid'"
    );

    const [[{ expiring_soon }]] = await pool.query(
      "SELECT COUNT(*) AS expiring_soon FROM members WHERE status = 'active' AND membership_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)"
    );

    // 2. Attendance trends - Last 7 days
    const [attRows] = await pool.query(`
      SELECT DATE(check_in_date) AS date, COUNT(*) AS count
      FROM attendance
      WHERE check_in_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(check_in_date)
    `);

    const attMap = {};
    attRows.forEach(r => {
      const d = new Date(r.date);
      const dStr = d.toISOString().slice(0, 10);
      attMap[dStr] = r.count;
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const attendance7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().slice(0, 10);
      const dayLabel = days[d.getDay()];
      attendance7Days.push({
        date: dStr,
        day: dayLabel,
        count: attMap[dStr] || 0
      });
    }

    // 3. Recent members
    const [recentMembers] = await pool.query(`
      SELECT m.id, u.full_name, mp.plan_name, mp.duration_months, m.join_date, m.status
      FROM members m
      JOIN users u ON m.user_id = u.id
      LEFT JOIN membership_plans mp ON m.plan_id = mp.id
      ORDER BY m.join_date DESC, m.id DESC
      LIMIT 4
    `);

    // 4. Classes with trainer and live booking counts
    const [classes] = await pool.query(`
      SELECT c.id, c.class_name, c.category, c.start_time, c.duration_minutes,
             t.full_name AS trainer_name, COUNT(ce.id) AS booked_count
      FROM classes c
      LEFT JOIN trainers t ON c.trainer_id = t.id
      LEFT JOIN class_enrollments ce ON ce.class_id = c.id
      GROUP BY c.id
      ORDER BY c.start_time ASC, c.id ASC
      LIMIT 3
    `);

    // 5. Payments due / pending / overdue
    const [paymentsDue] = await pool.query(`
      SELECT p.id, p.amount, p.payment_date, p.status, u.full_name, mp.plan_name
      FROM payments p
      JOIN members m ON p.member_id = m.id
      JOIN users u ON m.user_id = u.id
      LEFT JOIN membership_plans mp ON m.plan_id = mp.id
      WHERE p.status IN ('pending', 'due', 'overdue')
      ORDER BY p.payment_date ASC
      LIMIT 3
    `);

    res.json({
      stats: {
        active_members: Number(active_members) || 0,
        checked_in_today: Number(checked_in_today) || 0,
        revenue_this_month: Number(revenue_this_month) || 0,
        total_revenue: Number(total_revenue) || 0,
        expiring_soon: Number(expiring_soon) || 0
      },
      attendance: attendance7Days,
      recent_members: recentMembers,
      classes: classes,
      payments_due: paymentsDue
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats.', error: err.message });
  }
}

module.exports = { getDashboardStats };
