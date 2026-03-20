const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.getHome);
router.get('/subject/:name', mainController.getSubject);
router.get('/experiment/:id', mainController.getExperiment);
router.get('/quizzes', mainController.getQuizzes);
router.get('/profile', mainController.getProfile);
router.post('/profile/update', mainController.postUpdateProfile);
router.post('/api/quiz-result', mainController.postQuizResult);
router.get('/about', mainController.getAbout);

module.exports = router;
