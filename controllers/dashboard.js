const {createSpreadsheet} = require('../services/sheets');
const mongoose = require('mongoose');
const User = require('../models/User'); 
const Submission = require('../models/Submissions'); 
const Problem = require('../models/Problem'); 
const MaterializedView = require('../models/materializedView'); 

/* Aggregation Pipelines are required! */

exports.DBchange = async (req, res) => 
    {
        try{
            
            const {STORE_TO_DB} = req.body;
            const original = req.user.storeToDB;
            req.user.storeToDB = STORE_TO_DB;

            if(original === false && STORE_TO_DB === true)
            {
                console.log("Writing a new Spreadsheet");
                const sid = await createSpreadsheet("LeetCode Tracker", req);
                req.user.spreadSheetId = sid;
                await req.user.save();

            }
            else if(original === true && STORE_TO_DB === false)
            {
                // Change rowIds to -1
                await Submission.updateMany({ userId: req.user._id }, { $set: { rowNum: -1 } })
            }
        
            await req.user.save();
        }

        catch (err) 
        {
            console.error(req.user._id, " (DBChange):  ", err);
            return res.status(500).json({ message: "An error occurred", error: err.message });
        }
        return res.status(200).json({ message: "Success" });
    };

exports.updateProfile = async (req, res) => 
{
    const {firstName="", lastName="", leetcodeId="", displayName=""} = req.body;

    if(firstName)
    {
        req.user.firstName = firstName;
    }
    if(lastName)
    {
        req.user.lastName = lastName;
    }
    if(displayName)
    {
        req.user.displayName = displayName;
    }
    if(leetcodeId)
    {
        req.user.leetcodeId = leetcodeId;
    }

    try
    {
        await req.user.save();
    }
    catch (err) 
    {
        console.error(req.user._id, " (UPDATE PROFILE):  ", err.message);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
    return res.status(200).json({ message: "Success" });
};

exports.getProfile = async (req, res) => 
{
    try {
        console.log(req.user._id);


    let obb = {email: req.user.email, 
        leetcodeId: req.user.leetcodeId, 
        displayName: req.user.displayName, 
        firstName: req.user.firstName, 
        lastName: req.user.lastName, 
        createdAt: req.user.createdAt,
        storeToDB: req.user.storeToDB,
        spreadsheetId: req.user.spreadSheetId
    };

    console.log(obb);

    return res.status(200).json({ message: "Success", data: obb });
}

    catch (err) 
    {
        console.error(req.user._id, " (GET PROFILE):   ", err.message);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

exports.deleteProfile = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = req.user._id;

        const submissions = await Submission.find(
            { userId: userId },
            'problemId userId markForRevisit' // Only select these fields
        ).session(session);

        for (const submission of submissions) {
            const problemId = submission.problemId;
            const markForRevisit = submission.markForRevisit;

            const updateFields = {
                $inc: { submissions: -1 }
            };

            if (markForRevisit >= 1) {
                updateFields.$inc.markForRevisit = -1;
            }

            await Problem.updateOne({ problemId: problemId }, updateFields).session(session);
        }

        await Submission.deleteMany({ userId: userId }).session(session);

        await User.findByIdAndDelete(userId).session(session);

        await session.commitTransaction();
        session.endSession();

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
    return res.status(200).json({ message: "Success"});
};

exports.getRevision = async (req, res) => {
    try {

        const result = await Submission.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    markForRevisit: { $gte: 1 }
                }
            },
            {
                $sample: { size: 1 } // Randomly sample one document
            },
            {
                $sample: { size: 1 } // Randomly sample one document
            },
            {
                $lookup: {
                    from: 'problems', // Collection name for the Problem schema
                    localField: 'problemId',
                    foreignField: 'problemId',
                    as: 'problemDetails'
                }
            },
            {
                $unwind: '$problemDetails' // Unwind the array to access the fields directly
            },
            {
              $addFields: {
                problemLink: '$problemDetails.problemLink'
              }
            },
            {
                $project: {
                    problemId: 1,
                    problemName: 1,
                    problemTopic: 1,
                    problemLink: 1,
                    _id: 0 // Optionally exclude the _id field
                }
            }
        ]);


        if (result.length === 0) 
        {
            return res.status(404).json({ message: "No marked submissions found." });
        }

        return res.status(200).json({ message: "Success", data: result });

    } 

    catch (err) 
    {
        console.error(req.user._id, " (GET RANDOM):   ", err.message);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
};


exports.getRevisionTopic = async (req, res) => {
    try {
        const {problemTopic} = req.body;

        const result = await Submission.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    markForRevisit: { $gte: 1 },
                    problemTopic: problemTopic
                }
            },
            {
                $sample: { size: 1 } // Randomly sample one document
            },
            {
                $lookup: {
                    from: 'problems', // Collection name for the Problem schema
                    localField: 'problemId',
                    foreignField: 'problemId',
                    as: 'problemDetails'
                }
            },
            {
                $unwind: '$problemDetails' // Unwind the array to access the fields directly
            },
            {
              $addFields: {
                problemLink: '$problemDetails.problemLink'
              }
            },
            {
                $project: {
                    problemId: 1,
                    problemName: 1,
                    problemTopic: 1,
                    problemLink: 1,
                    _id: 0 // Optionally exclude the _id field
                }
            }
        ]);


        if (result.length === 0) {
            return res.status(404).json({ message: "No marked submissions found." });
        }

        return res.status(200).json({ message: "Success", data: result });

    } 

    

    catch (err) 
    {
        console.error(req.user._id, " (GET RANDOM TOPIC):   ", err.message);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

exports.getCommunityStats = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;     // Current page number, default to 1
        const limit = parseInt(req.query.limit) || 50;  // Number of submissions per page, default to 50

        const skip = (page - 1) * limit; // Calculate the number of submissions to skip

        // Fetch the submissions with pagination
        const submissions = await MaterializedView.find().skip(skip).limit(limit);
        return res.status(200).json({ message: "Success", data: submissions });
    } 

    catch (err) 
    {
        console.error(req.user._id, " (GET COMMUNITY):   ", err.message);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }

};

exports.getMySubmissions = async (req, res) => 
{
    const pageSize = 50;
    const page = req.query.page;
    let totalSubmissions = req.user.totalSubmissions;
    let skipCount = totalSubmissions - (page * pageSize);

    if(skipCount < 0)
    {
        skipCount = 0;
    }

    try
    {

    const pipeline = [
        { $match: { userId: req.user._id } },
        
        { $skip: skipCount },
        
        { $limit: pageSize },

        {
          $lookup: {
            from: 'problems',
            localField: 'problemId',
            foreignField: 'problemId',
            as: 'problemDetails'
          }
        },

        {
            $unwind: '$problemDetails' // Unwind the array to access the fields directly
        },
        {
          $addFields: {
            problemLink: '$problemDetails.problemLink'
          }
        },

        { $project: { problemDetails: 0 } },
        
        {
          $project: {
            userId: 1,
            problemId: 1,
            problemName: 1,
            learning: 1,
            code: 1,
            markForRevisit: 1,
            problemLink: 1,
            _id: 0
          }
        }
      ];
    
      const submissions = await Submission.aggregate(pipeline);
      return res.status(200).json({ message: "Success", data: submissions });
    }
    catch (err) 
    {
        console.error(req.user._id, " (GET MY SUBMISSIONS):   ", err.message);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

exports.getTopic = async (req, res) => {
    const pageSize = 50;
    const page = req.query.page;
    const topic = req.query.topic;
    const skipCount = ((page-1) * pageSize);
    
    const pipeline = [
        { $match: { userId: req.user._id, problemTopic: topic } },
        
        { $skip: skipCount },
        
        { $limit: pageSize },
        
        {
          $lookup: {
            from: 'problems',
            localField: 'problemId',
            foreignField: 'problemId',
            as: 'problemDetails'
          }
        },
        
        {
            $unwind: '$problemDetails' // Unwind the array to access the fields directly
        },
        {
          $addFields: {
            problemLink: '$problemDetails.problemLink'
          }
        },

        { $project: { problemDetails: 0 } },
        
        {
          $project: {
            userId: 1,
            problemId: 1,
            problemName: 1,
            learning: 1,
            code: 1,
            markForRevisit: 1,
            problemLink: 1,
            _id: 0
          }
        }
      ];

      try {
    
      const submissions = await Submission.aggregate(pipeline);
      return res.status(200).json({ message: "Success", data: submissions });
      }
      catch (err) 
    {
        console.error(req.user._id, " (GET MY TOPIC):   ", err.message);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

// exports.getCommunityTopic = async (req, res) => {
    
// };
