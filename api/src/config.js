console.log("process.env.MONGO_URL ", process.env.MONGO_URL);
const MONGO_URL = process.env.MONGO_URL || "";
const PORT = process.env.PORT || 3000;
const secret = process.env.SECRET || "not-so-secret";
const APP_URL = "XX"
const ESURL = "XXX";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const ENVIRONMENT = process.env.NODE_ENV || "development";

module.exports = {
  PORT,
  MONGO_URL,
  secret,
  APP_URL,
  ENVIRONMENT,
  ESURL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
};
