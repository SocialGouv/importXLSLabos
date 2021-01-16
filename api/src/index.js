require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

require("./mongo");

const { PORT } = require("./config.js");

const app = express();

const origin = ["XXX"];
app.use(cors({ credentials: true, origin }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: "application/x-ndjson" }));
app.use(cookieParser());

app.use(express.static(__dirname + "/../public"));

app.use("/es", require("./controllers/es"));
app.use("/user", require("./controllers/user"));
app.use("/batch", require("./controllers/batch"));

const d = new Date();
console.log(d.toLocaleString());

app.get("/", async (req, res) => {
  const d = new Date();
  res.status(200).send("COUCOU " + d.toLocaleString());
});

// const batchObject = require("./models/batch");
// (async () => {
//   const arr = await batchObject.find({ laboratory: "ARS" });
//   for (let i = 0; i < arr.length; i++) {
//     await arr[i].delete();
//   }
//   console.log("END")
// })();

require("./passport")(app);

app.listen(PORT, () => console.log(`Listening on port ${PORT}. Env is ${process.env.NODE_ENV}`));
