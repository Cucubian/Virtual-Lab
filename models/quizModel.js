const db = require('../config/db');

const Quiz = {
  // Get all quizzes
  getAll: async () => {
    const [rows] = await db.execute('SELECT * FROM quizzes ORDER BY created_at DESC');
    return rows;
  },

  // Get by experiment
  getByExperimentId: async (expId) => {
    const [rows] = await db.execute('SELECT * FROM quizzes WHERE experiment_id = ?', [expId]);
    return rows;
  },

  // Add new quiz
  add: async (quizData) => {
    const { experiment_id, question, option_a, option_b, option_c, option_d, correct_option } = quizData;
    const [result] = await db.execute(
      'INSERT INTO quizzes (experiment_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [experiment_id, question, option_a, option_b, option_c, option_d, correct_option]
    );
    return result.insertId;
  },

  // Update quiz
  update: async (id, quizData) => {
    const { experiment_id, question, option_a, option_b, option_c, option_d, correct_option } = quizData;
    await db.execute(
      'UPDATE quizzes SET experiment_id = ?, question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ? WHERE id = ?',
      [experiment_id, question, option_a, option_b, option_c, option_d, correct_option, id]
    );
  },

  // Delete quiz
  delete: async (id) => {
    await db.execute('DELETE FROM quizzes WHERE id = ?', [id]);
  },

  // Get single quiz
  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM quizzes WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = Quiz;
