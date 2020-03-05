const { promisify } = require("util");
const graph = require("fbgraph");
const { Octokit } = require("@octokit/rest");
const Twit = require("twit");
const axios = require("axios");
const { google } = require("googleapis");
const validator = require("validator");

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render("api/index", {
    title: "API Examples"
  });
};

/**
 * GET /api/github
 * GitHub API Example.
 */
exports.getGithub = async (req, res, next) => {
  const github = new Octokit();
  try {
    const { data: repo } = await github.repos.get({
      owner: "sahat",
      repo: "hackathon-starter"
    });
    res.render("api/github", {
      title: "GitHub API",
      repo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/chart
 * Chart example.
 */
exports.getChart = async (req, res, next) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=compact&apikey=${process.env.ALPHA_VANTAGE_KEY}`;
  axios
    .get(url)
    .then(response => {
      const arr = response.data["Time Series (Daily)"];
      let dates = [];
      let closing = []; // stock closing value
      const keys = Object.getOwnPropertyNames(arr);
      for (let i = 0; i < 100; i++) {
        dates.push(keys[i]);
        closing.push(arr[keys[i]]["4. close"]);
      }
      // reverse so dates appear from left to right
      dates.reverse();
      closing.reverse();
      dates = JSON.stringify(dates);
      closing = JSON.stringify(closing);
      res.render("api/chart", {
        title: "Chart",
        dates,
        closing
      });
    })
    .catch(err => {
      next(err);
    });
};

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render("api/upload", {
    title: "File Upload"
  });
};

exports.postFileUpload = (req, res) => {
  req.flash("success", { msg: "File was uploaded successfully." });
  res.redirect("/api/upload");
};

exports.getGoogleDrive = (req, res) => {
  const token = req.user.tokens.find(token => token.kind === "google");
  const authObj = new google.auth.OAuth2({
    access_type: "offline"
  });
  authObj.setCredentials({
    access_token: token.accessToken
  });

  const drive = google.drive({
    version: "v3",
    auth: authObj
  });

  drive.files.list(
    {
      fields: "files(iconLink, webViewLink, name)"
    },
    (err, response) => {
      if (err) return console.log(`The API returned an error: ${err}`);
      res.render("api/google-drive", {
        title: "Google Drive API",
        files: response.data.files
      });
    }
  );
};

exports.getGoogleSheets = (req, res) => {
  const token = req.user.tokens.find(token => token.kind === "google");
  const authObj = new google.auth.OAuth2({
    access_type: "offline"
  });
  authObj.setCredentials({
    access_token: token.accessToken
  });

  const sheets = google.sheets({
    version: "v4",
    auth: authObj
  });

  const url =
    "https://docs.google.com/spreadsheets/d/12gm6fRAp0bC8TB2vh7sSPT3V75Ug99JaA9L0PqiWS2s/edit#gid=0";
  const re = /spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const id = url.match(re)[1];

  sheets.spreadsheets.values.get(
    {
      spreadsheetId: id,
      range: "Class Data!A1:F"
    },
    (err, response) => {
      if (err) return console.log(`The API returned an error: ${err}`);
      res.render("api/google-sheets", {
        title: "Google Sheets API",
        values: response.data.values
      });
    }
  );
};
