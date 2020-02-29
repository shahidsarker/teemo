const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName: String,
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    website: String,
    jobListings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobListing'
    }],
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;