const mongoose = require('mongoose');


const teamSchema = new mongoose.Schema({
  teamName: String,
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
