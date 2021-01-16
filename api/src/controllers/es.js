const https = require("https");
const aws4 = require("aws4");
const AWS = require("aws-sdk");
const passport = require("passport");
const express = require("express");
const router = express.Router();

const { ESURL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = require("../config.js");
const { capture } = require("../sentry");

router.post("/_msearch", exec);
router.post("/batch/_msearch", exec);

function exec(req, res) {
  const body = req.body;
  const path = req.originalUrl.replace("/es", "");
  const user = req.user;

  try {
    // console.log("ESURL",process.env.AWS_SECRET_ACCESS_KEY)
    const bodyFiltered = filter(body, user);
    // console.log("bodyFiltered", req.body);
    var opts = { host: ESURL, body: bodyFiltered, path, method: "POST", headers: { "Content-Type": "application/x-ndjson" } };
    aws4.sign(opts, { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY });
    https.request(opts, (res1) => res1.pipe(res)).end(opts.body || "");
  } catch (error) {
    console.log("ERROR", error);
    capture(error);
    res.status(500).send({ error });
  }
}

function filter(body, user) {
  return body;

  let filter = null;

  if (user._type === "prescriber") {
    if (user.role === "NORMAL") filter = { term: { prescriber_id: user._id } };
    if (user.role === "ADMIN") filter = { term: { organisation_id: user.organisation_id } };
    if (user.role === "SUPERVISOR" && user.organisation_group) filter = { term: { "organisation_group.keyword": user.organisation_group } };
  }

  if (user._type === "operator") {
    if (user.role === "ADMIN") return body;
    if (user.role === "NORMAL") filter = { terms: { organisation_id: user.organisations } };
  }

  if (!filter) return null;

  const arr = body.split(`\n`);
  const newArr = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (!(i % 2)) {
      newArr.push(arr[i]);
    } else {
      const str = arr[i];
      const q = JSON.parse(str);
      if (!q.query.bool) {
        if (q.query.match_all) {
          q.query = { bool: { must: { match_all: {} } } };
        } else {
          const tq = q.query;
          delete q.query;
          q.query = { bool: { must: tq } };
        }
      }
      q.query.bool.filter = filter;
      newArr.push(JSON.stringify(q));
    }
  }
  return newArr.join(`\n`) + `\n`;
}

module.exports = router;
