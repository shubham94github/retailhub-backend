'use strict';
var path = require('path');
var chalk = require('chalk');
var globArray = require('glob-array');

module.exports = function(app) {
  console.log(chalk.cyan('Load Server Routes files'));
  loadAllApiRoutes(app);
};


/**
 * @author Kamal Bhera
 * @description This loadAllApiRoutes function is use for inititalise the all 
 * routes files when we start this backend server and It 
 * will print the all routes file name in blue color
 * @important We have to create new route file inside the route folder
 * and file name should be end with ******".routes.js"******     
 */
function loadAllApiRoutes(app){
//Locate the routes files using the glob-array module
var routesFiles = globArray.sync([path.join('./routes/*.routes.js')]);
routesFiles.forEach(function(routePath) {
  console.log(chalk.cyan('  ' + path.basename(routePath)));
  require('../'+routePath)(app);
});
}