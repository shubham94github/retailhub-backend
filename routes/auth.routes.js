'use strict';
var path = require('path');
// var auth = require('../configuration/authentication');

/**
 * @description This function is used for create all admin related api 
 * We can add and call the middleware function by auth variable 
 */
 module.exports = function (app) {
  var AuthController = require(path.join('../controllers/auth.controller'));
  app.get('/api/auth/linkedin', AuthController.loginByLinkedin)

}