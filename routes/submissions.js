const express = require('express');
const router = express.Router();
const Submission = require('../models/submission');
const Users = require("../models/Users");
const authMiddleware = require('../middleware/auth');

router.get('/check-entry/:leetcode_uname/:problemId', authMiddleware, async (req, res) => {
  try {
    const { problemId, leetcode_uname } = req.params;
    const userId = req.user._id;

    const u = await Users.findOne(userId);

    if(leetcode_uname != u.leetcode_id)
    {
        return res.status(500).json({ error: 'Authentication Error. Make sure you are signed in with your own LeetCode Account!' });
    }

    const submission = await Submission.findOne({ userId: userId, problemId: problemId });

    if (submission) 
    {
        return res.json(submission);
    } 
    else 
    {
        return res.json({ message: 'No prior entry found for this problem.' });
    }
    
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
