const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Dashboard = require('../controllers/dashboard');

router.get('/get-profile', authMiddleware, Dashboard.getProfile);
router.put('/update-profile', authMiddleware, Dashboard.updateProfile);
router.delete('/delete-profile', authMiddleware, Dashboard.deleteProfile);
router.get('/get-random', authMiddleware, Dashboard.getRevision);
router.get('/get-random-topic', authMiddleware, Dashboard.getRevisionTopic);
router.get('/get-community', authMiddleware, Dashboard.getCommunityStats);
router.get('/get-submissions', authMiddleware, Dashboard.getMySubmissions);
router.get('/get-submissions-topic', authMiddleware, Dashboard.getTopic);
router.patch('/db-change', authMiddleware, Dashboard.DBchange);

module.exports = router;