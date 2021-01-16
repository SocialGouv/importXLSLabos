const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// const sendinblue = require("../sendinblue");

const MODELNAME = "user";

const Schema = new mongoose.Schema({
  name: { type: String },

  email: { type: String, required: true, unique: true, trim: true },
  avatar: { type: String },

  password: String,

  last_login_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },

  forgot_password_reset_token: { type: String, default: "" },
  forgot_password_reset_expires: { type: Date },

  role: { type: String, enum: ["normal", "admin"], default: "normal" },
});

Schema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    bcrypt.hash(this.password, 10, (e, hash) => {
      this.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

Schema.methods.comparePassword = function (p) {
  return bcrypt.compare(p, this.password || "");
};

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
