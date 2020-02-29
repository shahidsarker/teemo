const teams = require("./team").allTeams();

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  console.log(teams);
  res.render("home", {
    title: "Home",
    teams: teams
  });
};
