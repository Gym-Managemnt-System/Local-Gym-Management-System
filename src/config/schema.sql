-- Gym Membership Management System - Database Schema
-- Run this once against your MySQL instance to create the database structure.

CREATE DATABASE IF NOT EXISTS gym_management;
USE gym_management;

-- FR-2: Users (admins + members) for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'member', 'trainer') NOT NULL DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FR-3: Membership plans
CREATE TABLE IF NOT EXISTS membership_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plan_name VARCHAR(100) NOT NULL,
  duration_months INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT
);

-- FR-1, FR-3, FR-8: Members and their membership status
CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT,
  join_date DATE NOT NULL,
  membership_start DATE,
  membership_end DATE,
  status ENUM('active', 'expired', 'deactivated') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE SET NULL
);

-- FR-5: Trainers
CREATE TABLE IF NOT EXISTS trainers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  full_name VARCHAR(150) NOT NULL,
  specialization VARCHAR(150),
  phone VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- FR-5: Fitness classes
CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_name VARCHAR(150) NOT NULL,
  trainer_id INT,
  schedule_day VARCHAR(20),
  schedule_time TIME,
  capacity INT DEFAULT 20,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL
);

-- Class participation (many-to-many: members <-> classes)
CREATE TABLE IF NOT EXISTS class_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  class_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- FR-4: Attendance tracking
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  check_in_date DATE NOT NULL,
  check_in_time TIME,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- FR-6: Payments
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50),
  status ENUM('paid', 'pending', 'failed') DEFAULT 'paid',
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);
