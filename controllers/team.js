const Team = {
  teams: [
    { _id: 1, link: "#", name: "Hello", description: "Lorem ipsum" },
    { _id: 2, link: "#", name: "Hi There", description: "Lorem ip difference" },
    { _id: 3, link: "#", name: "Yup", description: "Lorem ip product" },
    { _id: 4, link: "#", name: "Yo", description: "Lorem ip quotient" }
  ]
};

exports.index = (req, res) => {
  res.render("teams/index", {
    title: "Teams",
    teams: Team.teams
  });
};

exports.new = (req, res) => {
  res.render("teams/new", {
    title: "New Team"
  });
};
