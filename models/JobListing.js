const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema({
    jobName: String,
    jobDescription: String,
});

const JobListing = mongoose.model('JobListing', jobListingSchema);
module.exports = JobListing;