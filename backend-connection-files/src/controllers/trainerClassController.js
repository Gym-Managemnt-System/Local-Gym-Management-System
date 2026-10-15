const pool = require('../config/db');

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

async function getTrainers(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM trainers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trainers.', error: err.message });
  }
}

// FR-5: Fitness classes
async function createClass(req, res) {
  try {
    const { class_name, trainer_id, schedule_day, schedule_time, capacity } = req.body;
    const [result] = await pool.query(
      `INSERT INTO classes (class_name, trainer_id, schedule_day, schedule_time, capacity)
       VALUES (?, ?, ?, ?, ?)`,
      [class_name, trainer_id, schedule_day, schedule_time, capacity || 20]
    );
    res.status(201).json({ message: 'Class created.', classId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create class.', error: err.message });
  }
}

async function getClasses(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, t.full_name AS trainer_name
      FROM classes c
      LEFT JOIN trainers t ON c.trainer_id = t.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch classes.', error: err.message });
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

module.exports = { createTrainer, getTrainers, createClass, getClasses, enrollMember };
