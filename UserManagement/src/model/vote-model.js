const mongoose = require('mongoose');

const pollingSchema = new mongoose.Schema({
  vote: {
    type: Number,
    required: true,
  },
  voter: {
    type: String,
    required: true,
  },
  votedFor: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    default: Date.now(),
  },
});

const modelVote = mongoose.model('polling', pollingSchema);

module.exports = { modelVote };
