
const User = require('../models/User'); 
const Submission = require('../models/Submissions'); 
const Problem = require('../models/Problem'); 
const {addToSpreadsheet} = require("../services/sheets");
const config = require('../config/mongoViewConfig');

// Handles updating and new additions.
exports.submit = async (req, res) => {
    const { leetcode_username, problem_id, problem_link, problemName, problem_topic, code, learning, markForRevisit } = req.body;

    console.log("Request Type: PATCH A SUBMISSION");

    if (req.user.leetcodeId !== leetcode_username) 
    {
        return res.status(400).json({status: 'AuthFailed', message: 'You are not authorized to do this. Make sure you are logged into your correct leetcode account! If you are logged into the account attached with the tracker profile and still encountering this issue, please contact the developer as soon as possible. Since, this application is made independently of LeetCode, we use sly and tricky ways to get hold of your leetcode ID. It is possible that LeetCode may have changed a few things on their website internals and we may have to update our own ways accordingly.'});
    }
    const u = req.user._id;
    const data = { markForRevisit : +markForRevisit, problemName: (problem_id + ". " + problemName), learning: learning, code: code, problemLink : problem_link};
    const SID = req.user.spreadSheetId;

    console.log("Data Received: ", req.body);

    let problem = await Problem.findOne({ problemId: problem_id });

    if(req.user.storeToDB)
    {
        try {
            let submission = await Submission.findOne({ userId: u, problemId: problem_id });
            if(submission)
            {
                // First, try to update in the SpreadSheet.
                console.log("Modifying the following Submission: ", submission);
                let mode = (submission.problemTopic == problem_topic) ? (1) : (2);
                const row = await updateSpreadsheet(SID, problem_topic, data, req, submission.rowNum, mode, submission.problemTopic);
                console.log("SpreadSheet Updated: ", row);

                if(row !== -1)  // Add to DB.
                {
                    if(submission.markForRevisit === 0 && markForRevisit !== 0)
                    {
                        problem.markForRevisit++;
                    }
                    else if(submission.markForRevisit!== 0 && markForRevisit === 0)
                    {
                        problem.markForRevisit--;
                    }
                    if(+markForRevisit !== submission.markForRevisit || problem_topic != submission.problemTopic)
                    {
                        config.setChangesDetected(true);            // re-create the cached views in next throttling interval.
                    }

                    problem.save();

                    submission.learning = learning;
                    submission.code = code;
                    submission.markForRevisit = +markForRevisit;
                    submission.problemTopic = problem_topic;
                    submission.rowNum = row;
                    await submission.save();


                }
            }
            else
            {
                console.log("Creating a new Submission");
                if (problem) 
                {
                    problem.submissions += 1;
                    if (+markForRevisit) 
                    {
                        problem.markForRevisit += 1;
                    }
                    await problem.save();
                } else {
                    problem = new Problem({
                        problemId: problem_id,
                        problemName: problemName,
                        problemLink: problem_link,
                        submissions: 1,
                        markForRevisit: +markForRevisit ? 1 : 0,
                    });
                    await problem.save();
                }

                const row = await updateSpreadsheet(SID, problem_topic, data, req, -1, 0);
                console.log("SpreadSheet Updated: ", row);

                if(row !== -1)  // Add to DB.
                {
                    submission = new Submission({
                        userId: u,
                        problemId: problem_id,
                        problemName: problemName,
                        learning: learning,
                        code: code,
                        markForRevisit: +markForRevisit,
                        problemTopic: problem_topic,
                        rowNum: row
                    });
                        
                    await submission.save();
                    await User.findByIdAndUpdate(
                        req.user._id,
                        { $inc: { totalSubmissions: 1 } }
                    );

                    if(+markForRevisit !== 0)
                    {
                        config.setChangesDetected(true);            // re-create the cached views in next throttling interval.
                    }
                }
            }

            
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({message: err.message});
        }
    }
    else
    {
        await updateSpreadsheet(SID, problem_topic, data, req, -1, 0);
    }

    console.log("PROCESSED");

    return res.status(200).json({message: "Success"});
        
};

async function updateSpreadsheet(SID, problem_topic, data, req, row, mode, o="")
{
    try {
        const rID = await addToSpreadsheet(SID, problem_topic, data, req, row, mode, o); 
        return rID;
    }
    catch(err) {
        console.log("Spreadsheet Failed: ", err.message);
        return -1;
    }
}

exports.retrieveSubmission = async (req, res) => {
    const leetcode_username = req.query.leetcode_username;
    const problem_id = +req.query.problem_id;
    
    // Check if the leetcode username matches the user's stored username
    if (req.user.leetcodeId !== leetcode_username) 
    {
        return res.status(400).send('You are not authorized to do this. Make sure you are logged into your correct leetcode account! If you are logged into the account attached with the tracker profile and still encountering this issue, please contact the developer as soon as possible. Since, this application is made independently of LeetCode, we use sly and tricky ways to get hold of your leetcode ID. It is possible that LeetCode may have changed a few things on their website internals and we may have to update our own ways accordingly.');
    }

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
            submission.code = submission.code.replaceAll('\\n', '\n');
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