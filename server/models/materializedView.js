const mongoose = require('mongoose');
const { Schema } = mongoose;

const materializedViewSchema = new Schema({
  problemId: {
    type: Number,
    index: true // Index for quick lookups
  },
  problemName: String,
  markForRevisit: {
    type: Number,
  },
  problemLink: String,
  submissions: Number
}); 

module.exports= mongoose.model('MaterializedView', materializedViewSchema);
