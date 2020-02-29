/**
 * GET /teams
 * List all teams.
 */
const Team = require('../models/Team.js');

exports.getTeams = (req, res) => {
  Team.find((err, users) => {
    res.render('teams', { team: users });
  });
};
