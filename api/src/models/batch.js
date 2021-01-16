const mongoose = require("mongoose");
const mongoosastic = require("../es/mongoosastic");

const MODELNAME = "batch";

const Schema = new mongoose.Schema({
  site: { type: String, required: true, index: true },
  laboratory: { type: String, required: true, index: true },
  date: { type: Date, required: true }, //
  moment: { type: String, enum: ["Après-Midi", "Matin", "Non spécifié"], required: true },
  delay: { type: Number, required: true, default: 0 },
  test_symptomatic_count: { type: Number, required: true, default: 0 },
  test_asymptomatic_count: { type: Number, required: true, default: 0 },
  test_unspecified_count: { type: Number, required: true, default: 0 },
  test_total_count: { type: Number, required: true, default: 0 },
  positive_count: { type: Number, required: true, default: 0 },
  negative_count: { type: Number, required: true, default: 0 },
  user_email: { type: String },
  updated_at: { type: Date, default: Date.now },
});

Schema.plugin(mongoosastic, MODELNAME);

const OBJ = mongoose.model(MODELNAME, Schema);

module.exports = OBJ;
