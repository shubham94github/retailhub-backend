"use strict";

var convict = require("convict");
var path = require("path");

/**
 * @author Kamal Bhera
 * @description This is config convict file we can add default keys value on environment basis
 * We can update keys value from envrionment file
 */
var conf = convict({
  environment: {
    doc: "The application environment",
    format: ["production", "staging", "development", "localhost"],
    default: "development",
    env: "NODE_ENV"
  },
  port: {
    doc: "The application server port",
    format: "*",
    default: "3000"
  },
  database: {
    doc: "Which database you are using",
    format: "*",
    default: "postgres"
  },
  db: {
    doc: "The SQL Database Name",
    format: "*",
    default: "retailhub"
  },
  sqlHost: {
    doc: "Sql Database Host Name",
    format: "*",
    default: "localhost"
  },
  sqlUser: {
    doc: "Sql Database User Name",
    format: "*",
    default: "postgres"
  },
  sqlPassword: {
    doc: "Sql Database Password",
    format: "*",
    default: "Kamal@123#"
  },
  authSecret: {
    doc: "The secret to use for token generation",
    format: "*",
    default: "hestabit"
  },
  appHost: {
    doc: "The app host will update on environment frontend host basis",
    format: "*",
    default: "http://localhost:3000/#!/"
  },
  corsOrigin: {
    doc:
      "The CORS Allow Origin Header value. * allows all origins while a string " +
      "will restrict to origins that contain that string.",
    format: "*",
    default: "development"
  },
  defaultPic: {
    doc: "Default pic url when user will be register",
    format: "*",
    default:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"
  },
  emailLinkBase: {
    doc: "The base URL used for email links",
    format: "*",
    default: "http://localhost:3000"
  },
  deliverEmails: {
    doc: "The test email address to use. Note it is invalid and will result in a rejection from Mailgun",
    format: "*",
    default: "retailhubtech@gmail.com"
  },
  emailFromAddress: {
    doc: "The test email address to use. Note it is invalid and will result in a rejection from Mailgun",
    format: "*",
    default: "retailhubtech@gmail.com"
  },
  mailgunApiKey: {
    doc: "The mailgun API key",
    format: "*",
    default: "cd66864ddd7f9ecc7c5d7e6e146e6e88bee-0be3b63b-403ca994"
  },
  mailgunDomain: {
    doc: "Mailgun whitelisted domain",
    format: "*",
    default: "sandboxf35xss409e0244242bd8de80731ec1a9bd7.mailgun.org"
  },
  email: {
    doc: "The mail should be deliver by this email",
    format: "*",
    default: "retailhubtech@gmail.com"
  },
  filePathUrl: {
    doc: "The default file path URL",
    format: "*",
    default: path.resolve("../uploads")
  },
  elasticsearchLocalhost: {
    doc: "The default host path URL",
    format: "*",
    default: "http://elastic:ph8cp4Doz1i=lCRlIvRi@35.242.186.82:9200/"
  },
  elasticsearchProdhost: {
    doc: "The default host path URL",
    format: "*",
    default: "http://elastic:WGj6gbSGVHY9dZZpfumX=lCRlIvRi@34.142.21.166:9200/"
  }
});

/**
 * @author Kamal Bhera
 * @description Here environment file name will get from environment folder to configure.
 */
var environment = conf.get("environment");
conf.loadFile("./environment/" + environment + ".json");

module.exports = conf;
