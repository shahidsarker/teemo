const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: String,
    projectLink: String,
    projectDescription: String
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;