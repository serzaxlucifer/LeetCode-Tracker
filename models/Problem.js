const mongoose = require('mongoose');
const { Schema } = mongoose;


const problemSchema = new Schema({
  problemId: { type: Number, index: true, validate: {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer!'
  } },
  problemName: String,
  markForRevisit: { type: Number, default: 0, index: true, validate: {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer!',
  } },
  problemLink: String,
  submissions: { type: Number, default: 0, validate: {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer!'
  } },
});

mongoose.model('Problem', problemSchema);
