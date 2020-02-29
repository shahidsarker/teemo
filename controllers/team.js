const Team = {
  teams: [
    {
      _id: 1,
      link: "#",
      name: "Tune Squad",
      description: "Lorem ipsum",
      progress: 75,
      members: [
        { name: "John", skills: ["-", 8.5, 7, 5, 8, 2] },
        { name: "Jane", skills: [8.5, 7, "-", 5, 8, 2] },
        { name: "Lisa", skills: [7, 5, 6.5, 8, "-", 2] }
      ]
    },
    {
      _id: 2,
      link: "#",
      name: "Monstars",
      description: "Lorem ip difference",
      progress: 45,
      members: [
        { name: "John", skills: ["-", 8.5, 7, 5, 8, 2] },
        { name: "Jane", skills: [8.5, 7, "-", 5, 8, 2] },
        { name: "Lisa", skills: [7, 5, 6.5, 8, "-", 2] }
      ]
    },
    {
      _id: 3,
      link: "#",
      name: "Justice League",
      description: "Lorem ip product",
      progress: 95,
      members: [
        { name: "John", skills: ["-", 8.5, 7, 5, 8, 2] },
        { name: "Jane", skills: [8.5, 7, "-", 5, 8, 2] },
        { name: "Lisa", skills: [7, 5, 6.5, 8, "-", 2] }
      ]
    },
    {
      _id: 4,
      link: "#",
      name: "Avengers",
      description: "Lorem ip quotient",
      progress: 65,
      members: [
        { name: "John", skills: ["-", 8.5, 7, 5, 8, 2] },
        { name: "Jane", skills: [8.5, 7, "-", 5, 8, 2] },
        { name: "Lisa", skills: [7, 5, 6.5, 8, "-", 2] }
      ]
    }
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

exports.team = (req, res) => {
  const team_id = req.params.id;
  const team = Team.teams[team_id - 1];
  console.log(team);
  res.render("teams/team", { title: team.name, team: team });
};

exports.allTeams = () => {
  return Team.teams;
};
