const db = require('../config/db');

const History = {
  // Save new result
  add: async (data) => {
    const { user_id, experiment_id, score, total_questions, correct_answers } = data;
    const [result] = await db.execute(
      'INSERT INTO quiz_history (user_id, experiment_id, score, total_questions, correct_answers) VALUES (?, ?, ?, ?, ?)',
      [user_id, experiment_id, score, total_questions, correct_answers]
    );
    return result.insertId;
  },

  // Get user history
  getByUserId: async (userId) => {
    const [rows] = await db.execute(
      'SELECT h.* FROM quiz_history h WHERE h.user_id = ? ORDER BY h.completed_at DESC',
      [userId]
    );
    return rows;
  },

  // Paginated user history
  getByUserIdPaginated: async (userId, limit, offset) => {
    const [rows] = await db.execute(
      'SELECT h.* FROM quiz_history h WHERE h.user_id = ? ORDER BY h.completed_at DESC LIMIT ? OFFSET ?',
      [userId, limit.toString(), offset.toString()]
    );
    return rows;
  },

  // Count user history
  countByUserId: async (userId) => {
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM quiz_history WHERE user_id = ?', [userId]);
    return rows[0].count;
  },

  // Get summary stats
  getStats: async (userId) => {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as total, AVG(score) as avgScore, SUM(correct_answers) as totalCorrect FROM quiz_history WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  },

  // Get all results (admin)
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT h.*, u.username, u.full_name FROM quiz_history h JOIN users u ON h.user_id = u.id ORDER BY h.completed_at DESC'
    );
    return rows;
  },

  // Paginated all results
  getAllPaginated: async (limit, offset) => {
    const [rows] = await db.execute(
      'SELECT h.*, u.username, u.full_name FROM quiz_history h JOIN users u ON h.user_id = u.id ORDER BY h.completed_at DESC LIMIT ? OFFSET ?',
      [limit.toString(), offset.toString()]
    );
    return rows;
  },

  // Count total history
  countAll: async () => {
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM quiz_history');
    return rows[0].count;
  },

  // Get global summary stats
  getGlobalStats: async () => {
    const [rows] = await db.execute('SELECT COUNT(*) as total, AVG(score) as avgScore FROM quiz_history');
    return rows[0];
  }
};

module.exports = History;
