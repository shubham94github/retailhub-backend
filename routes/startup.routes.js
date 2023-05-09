"use strict";
var path = require("path");
var auth = require("../configuration/authentication");
var { upload } = require("../services/controller.service");
/**
 * @description This function is used for create all user's related api
 * We can add and call the middleware function by auth variable
 */
module.exports = function (app) {
  var Startupcontroller = require(path.join("../controllers/startups.controller"));
  app.get("/api/v2/startup/search", Startupcontroller.getStartups);
  app.get("/api/startup/:name", Startupcontroller.getStartupByName);
  app.get("/api/v2/startup/:id", Startupcontroller.getStartupById);
  app.delete("/api/startup/remove/:id", Startupcontroller.destroy);
  app.post("/api/startup/submit-form", upload.single("image_src"), Startupcontroller.createStartupSubmitForm);
  app.get("/api/getstartup/form", Startupcontroller.getStartupsForm);
  app.get("/api/download-csv/startup-form",Startupcontroller.downloadStartupCSV);
  app.post("/api/startup/get-chatgpt-startup", Startupcontroller.genrateChatgptStartupList);
};
