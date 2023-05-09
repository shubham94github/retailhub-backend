'use strict';

var config = require('./config');

module.exports = configureCorsHeaders;

/**
 * @author Kamal Bhera
 * @description Here configure the cors header value to resolve cors issue on request api. 
 * @param {*} app 
 */
function configureCorsHeaders(app) {
  app.all('/*', function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });
}

function getCorsOrigin(request) {
  var configuredOrigin = config.get('corsOrigin');
  if (configuredOrigin === '*') {
    //All origins are allowed return a wildcard
    return configuredOrigin;
  } else {
    var requestOrigin = request.headers.origin;
    if (requestOrigin && requestOrigin.indexOf(configuredOrigin) > -1) {
      return requestOrigin;
    }
    return null;
  }
}
