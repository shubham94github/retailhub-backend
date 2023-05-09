'use strict';

const Joi = require('joi');
var responseHelper = require('../responseHelper');
var promise = require('bluebird');
const { REGEX } = require('../constants');


exports.validateCreateUser = validateCreateUser;
exports.validateResetPassword = validateResetPassword;
/**
 * @description Validate the key's of create user request body which is coming from the request.
 * @param {*} user Its request body of user
 * @param {*} response Its response
 * @returns 
 */
function validateCreateUser(user, response) {
  const userSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    isLinkedinUser: Joi.boolean().required(),
    password: Joi.string().optional().allow(''),
  });
  let isValidate = userSchema.validate(user, response);
  if (isValidate.error) {
    return validationErrorResponse(isValidate.error);
  }
  return promise.resolve(user);
}


function validateResetPassword(user, response) {
  const passwordSchema = Joi.object().keys({
    password: Joi.string().regex(REGEX.PASSWORD).required(),
    uuid: Joi.string().regex(REGEX.UUID),
    type: Joi.string(),
    oldPassword: Joi.string().regex(REGEX.PASSWORD)
  });
  let isValidate = passwordSchema.validate(user, response);
  if (isValidate.error) {
    return validationErrorResponse(isValidate.error);
  }
  return promise.resolve(user);
}

/**
 * @description Generate Error response if validation is failed
 * @param {*} error Error message 
 * @returns 
 */
function validationErrorResponse(error) {
  return promise.reject(responseHelper.wrapValidationError({ validationError: [error.details[0].message] }))
}

