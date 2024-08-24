const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Submission = require('../controllers/submissions');

router.get('/get-entry', authMiddleware, Submission.retrieveSubmission);
router.put('/send-entry', authMiddleware, Submission.submit);

module.exports = router;
