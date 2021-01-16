const express = require("express");
const path = require("path");
const hsts = require("hsts");
const { forceDomain } = require("forcedomain");

const app = express();
const port = 8080;

app.use(hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
app.use(express.static(path.join(__dirname, "../build")));

if (process.env.NODE_ENV === "production") {
  app.use(forceDomain({ hostname: "XXX", protocol: "https" }));
}

app.route("*").all((req, res) => {
  res.status(200).sendFile(path.join(__dirname, "/../build/index.html"));
});

app.listen(port, () => {
  console.log(`App listening at port:${port}`);
});
