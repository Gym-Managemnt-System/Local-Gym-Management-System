const pool = require('../config/db');
const PDFDocument = require('pdfkit');

// FR-9: Generates and streams a Membership Transfer Report as a downloadable PDF.
// Includes: profile, membership status, attendance %, payment history, classes + trainer, export date.
async function generateTransferReport(req, res) {
  try {
    const memberId = req.params.memberId;

    const [[member]] = await pool.query(
      `SELECT m.*, u.full_name, u.email, mp.plan_name, mp.duration_months
       FROM members m
       JOIN users u ON m.user_id = u.id
       LEFT JOIN membership_plans mp ON m.plan_id = mp.id
       WHERE m.id = ?`,
      [memberId]
    );
    if (!member) return res.status(404).json({ message: 'Member not found.' });

    const [attendanceRows] = await pool.query(
      'SELECT check_in_date FROM attendance WHERE member_id = ?',
      [memberId]
    );

    const [payments] = await pool.query(
      'SELECT amount, payment_date, payment_method, status FROM payments WHERE member_id = ? ORDER BY payment_date',
      [memberId]
    );

    const [classes] = await pool.query(
      `SELECT c.class_name, t.full_name AS trainer_name
       FROM class_enrollments ce
       JOIN classes c ON ce.class_id = c.id
       LEFT JOIN trainers t ON c.trainer_id = t.id
       WHERE ce.member_id = ?`,
      [memberId]
    );

    // Simple attendance percentage: check-ins vs. days since join
    const daysSinceJoin = Math.max(
      1,
      Math.ceil((new Date() - new Date(member.join_date)) / (1000 * 60 * 60 * 24))
    );
    const attendancePercentage = ((attendanceRows.length / daysSinceJoin) * 100).toFixed(1);

    // Build the PDF
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=transfer-report-${memberId}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text('Membership Transfer Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Export Date: ${new Date().toISOString().slice(0, 10)}`);
    doc.moveDown();

    doc.fontSize(14).text('Member Profile');
    doc.fontSize(11)
      .text(`Name: ${member.full_name}`)
      .text(`Email: ${member.email}`)
      .text(`Status: ${member.status}`)
      .text(`Plan: ${member.plan_name || 'N/A'} (${member.duration_months || 'N/A'} months)`)
      .text(`Membership Duration: ${member.membership_start || 'N/A'} to ${member.membership_end || 'N/A'}`);
    doc.moveDown();

    doc.fontSize(14).text('Attendance Summary');
    doc.fontSize(11).text(`Total Check-ins: ${attendanceRows.length}`);
    doc.text(`Attendance Percentage: ${attendancePercentage}%`);
    doc.moveDown();

    doc.fontSize(14).text('Payment History');
    if (payments.length === 0) {
      doc.fontSize(11).text('No payment records.');
    } else {
      payments.forEach(p => {
        doc.fontSize(11).text(
          `${p.payment_date} - ${p.amount} (${p.payment_method || 'N/A'}) - ${p.status}`
        );
      });
    }
    doc.moveDown();

    doc.fontSize(14).text('Classes Attended & Trainer');
    if (classes.length === 0) {
      doc.fontSize(11).text('No class participation on record.');
    } else {
      classes.forEach(c => {
        doc.fontSize(11).text(`${c.class_name} - Trainer: ${c.trainer_name || 'Unassigned'}`);
      });
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate transfer report.', error: err.message });
  }
}

module.exports = { generateTransferReport };
