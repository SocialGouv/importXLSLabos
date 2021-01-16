const AWS = require("aws-sdk");

const { ESURL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = require("../config.js");

const options = {
  hosts: `https://${ESURL}`,
  connectionClass: require("http-aws-es"),
  awsConfig: new AWS.Config({ region: "eu-west-3", credentials: new AWS.Credentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) }),
};
const es = require("elasticsearch").Client(options);

const getElasticInstance = () => es;

module.exports = getElasticInstance;
