const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(isAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/quizzes', adminController.getQuizzes);
router.post('/quizzes/add', adminController.postAddQuiz);
router.post('/quizzes/edit/:id', adminController.postEditQuiz);
router.get('/quizzes/delete/:id', adminController.deleteQuiz);

// User Management
router.get('/users', adminController.getUsers);
router.get('/users/delete/:id', adminController.deleteUser);

// Statistics
router.get('/statistics', adminController.getStatistics);

module.exports = router;
