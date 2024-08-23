const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  problemId: {type: String},
  problemName: String,
  learning: String,
  code: String,
  markForRevisit: Number,
  problemTopic: String,
  submissionDate: { type: Date, default: Date.now },
  rowNum: Number
});

mongoose.model('Submission', submissionSchema);