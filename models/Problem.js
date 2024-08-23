const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
  problemId: { type: Number, index: true },
  problemName: String,
  markForRevisit: { type: Number, default: 0, index: true},
  problemLink: String,
  submissions: { type: Number, default: 0 },
});

module.exports= mongoose.model('Problem', problemSchema);
