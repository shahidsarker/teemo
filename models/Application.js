const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: mongoose.Schema.Type.ObjectId,
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  status: String

});

const Team = mongoose.model('Team', applicationSchema);
module.exports = Team;
