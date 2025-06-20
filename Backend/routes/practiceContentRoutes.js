const express = require('express');
const router = express.Router();
const practiceContentController = require('../controllers/practiceContentController');

// Practice content (exercise) routes
router.get('/practiceExercises', practiceContentController.getAllExercises);
router.get('/practiceExercise/:id', practiceContentController.getExerciseById);
router.post('/practiceExercise', practiceContentController.createExercise);
router.put('/practiceExercise/:id', practiceContentController.updateExercise);
router.delete('/practiceExercise/:id', practiceContentController.deleteExercise);
router.post('/practiceExercise/upload', practiceContentController.uploadFile);

module.exports = router; 