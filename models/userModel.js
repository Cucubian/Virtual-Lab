const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  // Find by ID
  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  // Find by username
  findByUsername: async (username) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },

  // Find by email
  findByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // Create new user
  create: async (userData) => {
    const { username, email, password, full_name, role = 'student' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, role]
    );
    return result.insertId;
  },

  // Update user info
  update: async (id, data) => {
    const { email, full_name, school_name } = data;
    await db.execute(
      'UPDATE users SET email = ?, full_name = ?, school_name = ? WHERE id = ?',
      [email, full_name, school_name, id]
    );
  },

  // Delete user
  delete: async (id) => {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
  },

  // Set OTP
  setOtp: async (email, otp, expiresAt) => {
    await db.execute(
      'UPDATE users SET otp_code = ?, otp_expires = ? WHERE email = ?',
      [otp, expiresAt, email]
    );
  },

  // Clear OTP
  clearOtp: async (email) => {
    await db.execute('UPDATE users SET otp_code = NULL, otp_expires = NULL WHERE email = ?', [email]);
  },

  // Update Password
  updatePassword: async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
  },

  // Paginated users with optional search
  findPaginated: async (limit, offset, search = '') => {
    let query = 'SELECT id, username, email, full_name, school_name, created_at FROM users WHERE role != "admin"';
    let params = [];

    if (search) {
      query += ' AND (username LIKE ? OR full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit.toString(), offset.toString());

    const [rows] = await db.execute(query, params);
    return rows;
  },

  // Count users with optional search
  count: async (search = '') => {
    let query = 'SELECT COUNT(*) as count FROM users WHERE role != "admin"';
    let params = [];

    if (search) {
      query += ' AND (username LIKE ? OR full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await db.execute(query, params);
    return rows[0].count;
  }
};

module.exports = User;
