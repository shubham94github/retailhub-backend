"use strict";
var path = require("path");
var auth = require("../configuration/authentication");

/**
 * @description This function is used for create all user's related api
 * We can add and call the middleware function by auth variable
 */
module.exports = function (app) {
  var Usercontroller = require(path.join("../controllers/user.controller"));
  app.post("/api/register", Usercontroller.createUser);
  app.post("/api/login", Usercontroller.userLogin);
  app.put("/api/user/verify", Usercontroller.verifyUser);
  app.post(
    "/api/resend/verification/:email",
    Usercontroller.resendVerification
  );
  app.post("/api/forgetPassword/:email", Usercontroller.forgetPassword);
  app.put("/api/reset/password", Usercontroller.resetPassword);
  app.put(
    "/api/password/update",
    auth.isloggedInForAll,
    Usercontroller.updatePassword
  );
  app.put(
    "/api/update/profile",
    auth.isloggedInForAll,
    Usercontroller.userUpdateProfile
  );
};
