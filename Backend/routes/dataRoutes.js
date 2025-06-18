const express = require('express');
const router = express.Router();
const generalDataController = require('../controllers/generalDataController');
const specificDataController = require('../controllers/specificUserDataController');
const userController = require('../controllers/userController');
const coursesDataController = require('../controllers/coursesDataController');
const topicDataController = require('../controllers/topicDataController');

/*  general data routes  */


// Route for fetching all users
router.get('/users',generalDataController.getUsers);
// Route for fetching all admins
router.get('/admins',generalDataController.getAdmins);
// Route for fetching all teachers
router.get('/teachers',generalDataController.getTeachers);
// Route for fetching all examinees
router.get('/examinees',generalDataController.getExaminees);
// Route for fetching practice data
router.get('/practice', generalDataController.getPracticeData);
// Route for fetching exam data
router.get('/exams',generalDataController.getExamData);
// Route for fetching all videos
router.get('/videos',generalDataController.getVideos);


/* specific data routes */

// Route for fetching specific user data
router.get('/user/:id', specificDataController.getSpecificUser);
// Route for fetching specific examinee data
router.get('/examinee/:id', specificDataController.getSpecificExaminee);
// Route for fetching specific teacher data
router.get('/teacher/:id', specificDataController.getSpecificTeacher);
// Route for fetching specific admin data
router.get('/admin/:id', specificDataController.getSpecificAdmin);


//user routes
// Route for adding a new user
router.post('/addUser', userController.createUser);
// Route for updating a user
router.put('/updateUser/:id', userController.updateUser);
// Route for deleting a user
router.delete('/deleteUser/:id', userController.deleteUser);


//courses routes

// Route for fetching all courses
router.get('/getCourses', coursesDataController.getAllCourses);
// Route for fetching a specific course by ID
router.get('/getCourse/:id', coursesDataController.getCourseById);
// Route for adding a new course
router.post('/addCourse', coursesDataController.createCourse);
// Route for updating an existing course
router.put('/updateCourse/:id', coursesDataController.updateCourse);
// Route for deleting a course
router.delete('/deleteCourse/:id', coursesDataController.deleteCourse);


//topic routes
// Route for fetching all topics
router.get('/getTopics', topicDataController.getAllTopics);
// Route for fetching a specific topic by ID
router.get('/getTopic/:id', topicDataController.getTopicById);
// Route for adding a new topic
router.post('/addTopic', topicDataController.createTopic);
// Route for updating an existing topic
router.put('/updateTopic/:id', topicDataController.updateTopic);
// Route for deleting a topic
router.delete('/deleteTopic/:id', topicDataController.deleteTopic);


module.exports = router;