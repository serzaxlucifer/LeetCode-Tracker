const mongoose = require('mongoose');
const User = require('../models/User'); 
const Submission = require('../models/Submissions'); 
const Problem = require('../models/Problem'); 
const {addToSpreadsheet} = require("../services/sheets");
const config = require('../config/mongoViewConfig');

// Handles updating and new additions.
exports.submit = async (req, res) => {
    const { leetcode_username, problem_id, problem_link, problemName, problem_topic, code, learning, markForRevisit } = req.body;
    
    // Check if the leetcode username matches the user's stored username
    
    let found = false;
    if (req.user.leetcodeId !== leetcode_username) 
    {
        return res.status(400).send('You are not authorized to do this. Make sure you are logged into your correct leetcode account! If you are logged into the account attached with the tracker profile and still encountering this issue, please contact the developer as soon as possible. Since, this application is made independently of LeetCode, we use sly and tricky ways to get hold of your leetcode ID. It is possible that LeetCode may have changed a few things on their website internals and we may have to update our own ways accordingly.');
    }
    const u = req.user._id;
        
    try {
    let submission = await Submission.findOne({ userId: u, problemId: problem_id });
    
    if (req.user.storeToDB) 
    {
        if (submission) 
        {
            if(markForRevisit !== submission.markForRevisit)
            {
                config.setChangesDetected(true);
            }

            found = true;
            submission.learning = learning;
            submission.code = code;
            submission.markForRevisit = markForRevisit;
            submission.problemTopic = problem_topic;
            await submission.save();

        } else {
            console.log("Creating new submission");
            submission = new Submission({
            userId: u,
            problemId: problem_id,
            problemName: problemName,
            learning: learning,
            code: code,
            markForRevisit: markForRevisit,
            problemTopic: problem_topic,
            });

            if(markForRevisit >= 1)
            {
                config.setChangesDetected(true);
            }
            
            await submission.save();
            await User.findByIdAndUpdate(
                req.user._id,
                { $inc: { totalSubmissions: 1 } }
            );
              
        }
        
        // Find or create problem
        let problem = await Problem.findOne({ problemId: problem_id });
        if (problem) {
            problem.submissions += 1;
            if (markForRevisit) {
            config.setChangesDetected(true);
            problem.markForRevisit += 1;
            }
            await problem.save();
        } else {
            config.setChangesDetected(true);
            problem = new Problem({
            problemId: problem_id,
            problemLink: problem_link,
            submissions: 1,
            markForRevisit: markForRevisit ? 1 : 0,
            });
            await problem.save();
        }
    }


    // Save to Spreadsheet!
    // Prepare data to upload

    const data = { markForRevisit : markForRevisit, problemName: (problem_id + ". " + problemName), learning: learning, code: code, problemLink : problem_link};
    console.log(data);
    const SID = req.user.spreadSheetId;
    console.log(SID);
    
    const rID = await addToSpreadsheet(SID, problem_topic, data, req, (found ? submission.rowNum : -1));      // Add Error handling.
    submission.rowNum = rID;
    await submission.save();

    return res.status(200).json({message: "Success"});

}

catch(err)
{
    return res.status(500).json({message: err.message});
}
        
};

exports.retrieveSubmission = async (req, res) => {
    const { leetcode_username, problem_id } = req.body;
    
    // Check if the leetcode username matches the user's stored username
    if (req.user.leetcodeId !== leetcode_username) 
    {
        return res.status(400).send('You are not authorized to do this. Make sure you are logged into your correct leetcode account! If you are logged into the account attached with the tracker profile and still encountering this issue, please contact the developer as soon as possible. Since, this application is made independently of LeetCode, we use sly and tricky ways to get hold of your leetcode ID. It is possible that LeetCode may have changed a few things on their website internals and we may have to update our own ways accordingly.');
    }

    console.log("ProblemID: ", problem_id);

    let found = false;
    try{
    let submission = await Submission.findOne({ userId: req.user._id, problemId: problem_id });
    if (req.user.storeToDB) 
        {
            if (submission) 
            {
                found = true;
            }
        }
    
        if(found)
        {
            return res.status(200).json({ message: "FOUND", submission: submission});
        }
        else
        {
            return res.status(201)({ message: "NOT FOUND", submission: ""});
        }    

}
catch(err)
{
    return res.status(500).json({message: err.message});
}
};