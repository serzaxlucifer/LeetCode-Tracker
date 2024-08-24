const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  problemId: {type: Number},
  problemName: String,
  learning: String,
  code: String,
  markForRevisit: Number,
  problemTopic: String,
  submissionDate: { type: Date, default: Date.now },
  rowNum: Number
});

module.exports = mongoose.model('Submission', submissionSchema);