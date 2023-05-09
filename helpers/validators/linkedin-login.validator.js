'use strict';

const Joi = require('joi');
var responseHelper = require('../responseHelper');
var promise = require('bluebird');


exports.validateLinkedingLogin = validateLinkedingLogin;

/**
 * @author Kamal Bhera
 * @description Validate the key's of login user request body which is coming from the request.
 * @param {*} user Its request body of user
 * @param {*} response Its response
 * @returns 
 */
function validateLinkedingLogin(user, response) {
  const userSchema = Joi.object().keys({
    state: Joi.string().required(),
    code: Joi.string().required(),
  });
  let isValidate = userSchema.validate(user, response);
  if (isValidate.error)
    return validationErrorResponse(isValidate.error);
  return promise.resolve(user);
}
/**
 * @author Kamal Bhera
 * @description Generate Error response if validation is failed
 * @param {*} error Error message 
 * @returns 
 */
function validationErrorResponse(error) {
  return promise.reject(responseHelper.wrapValidationError({ validationError: [error.details[0].message] }))
}

