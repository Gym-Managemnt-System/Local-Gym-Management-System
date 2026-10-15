const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// FR-5: Trainers
async function createTrainer(req, res) {
  try {
    const { user_id, full_name, specialization, phone } = req.body;
    const [result] = await pool.query(
      'INSERT INTO trainers (user_id, full_name, specialization, phone) VALUES (?, ?, ?, ?)',
      [user_id || null, full_name, specialization, phone]
    );
    res.status(201).json({ message: 'Trainer added.', trainerId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add trainer.', error: err.message });
  }
}

// Admin registers a new trainer (creates user + trainer profile in one transaction)
async function registerTrainer(req, res) {
  const connection = await pool.getConnection();
  try {
    const { full_name, email, password, phone, dob, gender, address, username, specialization } = req.body;

    if (!full_name || !email || !password) {
      connection.release();
      return res.status(400).json({ message: 'full_name, email and password are required.' });
    }

    await connection.beginTransaction();

    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      `INSERT INTO users (full_name, email, password_hash, role, username, phone, dob, gender, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, password_hash, 'trainer', username || null, phone || null, dob || null, gender || null, address || null]
    );
    const userId = userResult.insertId;

    const [trainerResult] = await connection.query(
      `INSERT INTO trainers (user_id, full_name, specialization, phone) VALUES (?, ?, ?, ?)`,
      [userId, full_name, specialization || null, phone || null]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Trainer registered successfully.',
      userId,
      trainerId: trainerResult.insertId
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    res.status(500).json({ message: 'Failed to register trainer.', error: err.message });
  }
}

async function getTrainers(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT t.*,
        COUNT(DISTINCT c.id) AS classes_count,
        COUNT(DISTINCT ce.member_id) AS members_count
      FROM trainers t
      LEFT JOIN classes c ON c.trainer_id = t.id
      LEFT JOIN class_enrollments ce ON ce.class_id = c.id
      GROUP BY t.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trainers.', error: err.message });
  }
}

// FR-5: Fitness classes
async function createClass(req, res) {
  try {
    const { class_name, category, trainer_id, start_time, duration_minutes, max_capacity } = req.body;

    if (!class_name || !category || !trainer_id || !start_time) {
      return res.status(400).json({ message: 'class_name, category, trainer_id and start_time are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO classes (class_name, category, trainer_id, start_time, duration_minutes, max_capacity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [class_name, category, trainer_id, start_time, duration_minutes || 45, max_capacity || 20]
    );
    res.status(201).json({ message: 'Class created.', classId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create class.', error: err.message });
  }
}

// booked_count is computed live from class_enrollments, not read from the stored column
async function getClasses(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT
        c.id, c.class_name, c.category, c.trainer_id, c.start_time,
        c.duration_minutes, c.max_capacity, c.created_at,
        t.full_name AS trainer_name,
        COUNT(ce.id) AS booked_count
      FROM classes c
      LEFT JOIN trainers t ON c.trainer_id = t.id
      LEFT JOIN class_enrollments ce ON ce.class_id = c.id
      GROUP BY c.id
      ORDER BY c.start_time
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch classes.', error: err.message });
  }
}

// Update an existing class
async function updateClass(req, res) {
  try {
    const { id } = req.params;
    const { class_name, category, trainer_id, start_time, duration_minutes, max_capacity } = req.body;

    const [result] = await pool.query(
      `UPDATE classes SET
        class_name = COALESCE(?, class_name),
        category = COALESCE(?, category),
        trainer_id = COALESCE(?, trainer_id),
        start_time = COALESCE(?, start_time),
        duration_minutes = COALESCE(?, duration_minutes),
        max_capacity = COALESCE(?, max_capacity)
       WHERE id = ?`,
      [
        class_name || null,
        category || null,
        trainer_id || null,
        start_time || null,
        duration_minutes || null,
        max_capacity || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    res.json({ message: 'Class updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update class.', error: err.message });
  }
}

// Delete a class (also clears its enrollments)
async function deleteClass(req, res) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    await connection.query('DELETE FROM class_enrollments WHERE class_id = ?', [id]);
    const [result] = await connection.query('DELETE FROM classes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: 'Class not found.' });
    }

    await connection.commit();
    connection.release();

    res.json({ message: 'Class deleted.' });
  } catch (err) {
    await connection.rollback();
    connection.release();
    res.status(500).json({ message: 'Failed to delete class.', error: err.message });
  }
}

// Get members booked into a specific class
async function getClassMembers(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT m.id, u.full_name, u.email, u.phone, m.status, ce.enrolled_at
      FROM class_enrollments ce
      JOIN members m ON m.id = ce.member_id
      JOIN users u ON u.id = m.user_id
      WHERE ce.class_id = ?
      ORDER BY ce.enrolled_at
    `, [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch class members.', error: err.message });
  }
}

// Enroll a member into a class
async function enrollMember(req, res) {
  try {
    const { member_id, class_id } = req.body;
    await pool.query(
      'INSERT INTO class_enrollments (member_id, class_id) VALUES (?, ?)',
      [member_id, class_id]
    );
    res.status(201).json({ message: 'Member enrolled in class.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to enroll member.', error: err.message });
  }
}

module.exports = {
  createTrainer, getTrainers, createClass, getClasses, enrollMember, registerTrainer,
  updateClass, deleteClass, getClassMembers
};