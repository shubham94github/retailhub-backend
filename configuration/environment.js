'use strict';

var PRODUCTION = 'production';
var STAGING = 'staging';
var DEVELOPMENT = 'development';
var LOCALHOST = 'localhost';

exports.isProduction = isProduction;
exports.isStagingOrProduction = isStagingOrProduction;
exports.isDevelopment = isDevelopment;
exports.isStaging=isStaging;
exports.isLocalhost=isLocalhost;
exports.getEnvironment = getEnvironment;

function isProduction() {
  return getEnvironment() === PRODUCTION;
}

function isStagingOrProduction() {
  return getEnvironment() === STAGING || isProduction();
}

function isDevelopment() {
  return getEnvironment() === DEVELOPMENT;
}

function isLocalhost() {
  return getEnvironment() === LOCALHOST;
}

function isStaging(){
  return getEnvironment() === STAGING;
}

function getEnvironment() {
  console.log('process.env.NODE_ENV--',process.env.NODE_ENV)
  return process.env.NODE_ENV || LOCALHOST;
}
