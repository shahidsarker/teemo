const { promisify } = require("util");
const graph = require("fbgraph");
const { Octokit } = require("@octokit/rest");
const Twit = require("twit");
const lob = require("lob")(process.env.LOB_KEY);
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
 * GET /api/lob
 * Lob API example.
 */
exports.getLob = async (req, res, next) => {
  let recipientName;
  if (req.user) {
    recipientName = req.user.profile.name;
  } else {
    recipientName = "John Doe";
  }
  const addressTo = {
    name: recipientName,
    address_line1: "123 Main Street",
    address_city: "New York",
    address_state: "NY",
    address_zip: "94107"
  };
  const addressFrom = {
    name: "Hackathon Starter",
    address_line1: "123 Test Street",
    address_line2: "Unit 200",
    address_city: "Chicago",
    address_state: "IL",
    address_zip: "60012",
    address_country: "US"
  };

  const lookupZip = () =>
    lob.usZipLookups
      .lookup({ zip_code: "94107" })
      .then(zipdetails => zipdetails)
      .catch(error =>
        Promise.reject(new Error(`Could not get zip code details: ${error}`))
      );

  const createAndMailLetter = () =>
    lob.letters
      .create({
        description: "My First Class Letter",
        to: addressTo,
        from: addressFrom,
        // file: minified version of https://github.com/lob/lob-node/blob/master/examples/html/letter.html with slight changes as an example
        file: `<html><head><meta charset="UTF-8"><style>body{width:8.5in;height:11in;margin:0;padding:0}.page{page-break-after:always;position:relative;width:8.5in;height:11in}.page-content{position:absolute;width:8.125in;height:10.625in;left:1in;top:1in}.text{position:relative;left:20px;top:3in;width:6in;font-size:14px}</style></head>
          <body><div class="page"><div class="page-content"><div class="text">
          Hello ${addressTo.name}, <p> We would like to welcome you to the community! Thanks for being a part of the team! <p><p> Cheer,<br>${addressFrom.name}
          </div></div></div></body></html>`,
        color: false
      })
      .then(letter => letter)
      .catch(error =>
        Promise.reject(new Error(`Could not create and send letter: ${error}`))
      );

  try {
    const uspsLetter = await createAndMailLetter();
    const zipDetails = await lookupZip();
    res.render("api/lob", {
      title: "Lob API",
      zipDetails,
      uspsLetter
    });
  } catch (error) {
    next(error);
  }
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
