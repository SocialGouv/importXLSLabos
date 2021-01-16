const express = require("express");
const passport = require("passport");
const router = express.Router();

const { capture } = require("../sentry");

const BatchObject = require("../models/batch");

const BATCH_ALREADY_EXISTS = "BATCH_ALREADY_EXISTS";
const SERVER_ERROR = "SERVER_ERROR";

router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const obj = { user_email: req.user.email };

    if (req.body.hasOwnProperty("site")) obj.site = req.body.site;
    if (req.body.hasOwnProperty("laboratory")) obj.laboratory = req.body.laboratory;
    if (req.body.hasOwnProperty("date")) obj.date = req.body.date;
    if (req.body.hasOwnProperty("delay")) obj.delay = req.body.delay;
    if (req.body.hasOwnProperty("test_symptomatic_count")) obj.test_symptomatic_count = req.body.test_symptomatic_count;
    if (req.body.hasOwnProperty("test_asymptomatic_count")) obj.test_asymptomatic_count = req.body.test_asymptomatic_count;
    if (req.body.hasOwnProperty("test_total_count")) obj.test_total_count = req.body.test_total_count;
    if (req.body.hasOwnProperty("moment")) obj.moment = req.body.moment;
    if (req.body.hasOwnProperty("positive_count")) obj.positive_count = req.body.positive_count;
    if (req.body.hasOwnProperty("negative_count")) obj.negative_count = req.body.negative_count;
    if (req.body.hasOwnProperty("updated_at")) obj.updated_at = req.body.updated_at;

    const batch = await BatchObject.findOneAndUpdate({ site: obj.site, laboratory: obj.laboratory, date: obj.date, moment: obj.moment }, obj, {
      upsert: true,
      new: true,
    });

    await batch.index();
    return res.status(200).send({ batch, ok: true });
  } catch (error) {
    if (error.code === 11000) return res.status(200).send({ ok: false, code: BATCH_ALREADY_EXISTS });
    capture(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

module.exports = router;
