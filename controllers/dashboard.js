const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = mongoose.model('User');
const Problem = mongoose.model('Problem');
const Submission = mongoose.model('Submission');
const MaterializedView = require('../models/materializedView'); 

/* Aggregation Pipelines are required! */

exports.updateProfile = async (req, res) => 
{
    const {firstName="", lastName="", leetcodeId="", displayName=""} = req.body;
    user = await User.findById(req.user._id);

    if(firstName)
    {
        user.firstName = firstName;
    }
    if(lastName)
    {
        user.lastName = lastName;
    }
    if(displayName)
    {
        user.displayName = displayName;
    }
    if(leetcodeId)
    {
        user.leetcodeId = leetcodeId;
    }

    await user.save();
};

exports.getProfile = async (req, res) => 
{
    user = await User.find(req.user._id);

    let obb = {email: user.email, 
        leetcodeId: user.leetcodeId, 
        displayName: user.displayName, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        createdAt: user.createdAt,
        storeToDB: user.storeToDB,
        spreadsheetId: user.spreadsheetId
    };

    return res.send(200).json(obb);
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

        return res.status(200).json({
            message: "Deleted Successfully.",
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

exports.getRevision = async (req, res) => {
    try {
        const userId = req.user._id;

        const result = await Submission.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId),
                    markForRevisit: { $gte: 1 }
                }
            },
            {
                $sample: { size: 1 } // Randomly sample one document
            },
            {
                $lookup: {
                    from: 'Problem', // Collection name for the Problem schema
                    localField: 'problemId',
                    foreignField: 'problemId',
                    as: 'problemDetails'
                }
            },
            {
                $project: {
                    problemId: 1,
                    problemName: 1,
                    problemLink: { $arrayElemAt: ['$problemDetails.problemLink', 2] }, // Access the third element
                    _id: 0 // Optionally exclude the _id field
                }
            }
        ]);


        if (result.length === 0) 
        {
            return res.status(404).json({ message: "No marked submissions found." });
        }

        return res.status(200).json(result[0]);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
};


exports.getRevisionTopic = async (req, res) => {
    try {
        const userId = req.user._id;
        const {problemTopic} = req.body;

        const result = await Submission.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId),
                    markForRevisit: { $gte: 1 },
                    problemTopic: problemTopic
                }
            },
            {
                $sample: { size: 1 } // Randomly sample one document
            },
            {
                $lookup: {
                    from: 'Problem', // Collection name for the Problem schema
                    localField: 'problemId',
                    foreignField: 'problemId',
                    as: 'problemDetails'
                }
            },
            {
                $project: {
                    problemId: 1,
                    problemName: 1,
                    problemLink: { $arrayElemAt: ['$problemDetails.problemLink', 2] }, // Access the third element
                    _id: 0 // Optionally exclude the _id field
                }
            }
        ]);


        if (result.length === 0) {
            return res.status(404).json({ message: "No marked submissions found." });
        }

        return res.status(200).json(result[0]);

    } catch (err) {
        console.error(err);
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

        // Return the paginated results
        return res.status(200).json(submissions);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }

};

exports.getMySubmissions = async (req, res) => 
{
    const pageSize = 50;
    const page = req.query.page;
    let totalSubmissions = await User.findById(req.user._id).totalSubmissions;
    const skipCount = totalSubmissions - (page * pageSize);

    if(skipCount < 0)
    {
        res.status(200).json([]);
    }

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
          $addFields: {
            problemLink: {
              $arrayElemAt: [{ $ifNull: ['$problemDetails.problemLink', null] }, 0]
            }
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
    
      const submissions = await Submission.aggregate(pipeline).toArray();
      res.status(200).json(submissions);
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
          $addFields: {
            problemLink: {
              $arrayElemAt: [{ $ifNull: ['$problemDetails.problemLink', null] }, 0]
            }
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
    
      const submissions = await Submission.aggregate(pipeline).toArray();
      return submissions;
};

// exports.getCommunityTopic = async (req, res) => {
    
// };
