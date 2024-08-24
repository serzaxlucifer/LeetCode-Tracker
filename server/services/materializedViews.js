const mongoose = require('mongoose');
const Problem = require('../models/Problem'); 
const MaterializedView = require('../models/materializedView'); 

const recreateMaterializedView = async () => 
{
    const results = await Problem.aggregate([
        { $sort: { markForRevisit: -1 } },
        { $project: { problemId: 1, problemName: 1, markForRevisit: 1, problemLink: 1, submissions: 1 } }
    ]);

    await MaterializedView.deleteMany({});
    await MaterializedView.insertMany(results);

    console.log('Materialized view recreated.');
};

module.exports = { recreateMaterializedView };
