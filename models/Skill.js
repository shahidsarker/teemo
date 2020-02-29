const mongoose = require('mongoose');


const skillSchema = new mongoose.Schema({
  skillName: String,
  category: String,
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;
