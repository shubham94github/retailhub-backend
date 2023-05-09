'use strict';

const Joi = require('joi');
var responseHelper = require('../responseHelper');
var promise = require('bluebird');


exports.validateCreateTags = validateCreateTags;
exports.validateUpdateTags = validateUpdateTags;

/**
 * @author Kamal Bhera
 * @description Validate the key's of create user request body which is coming from the request.
 * @param {*} user Its request body of user
 * @param {*} response Its response
 * @returns 
 */
function validateCreateTags(user, response) {
  const userSchema = Joi.object().keys({
    name: Joi.string().required(),
    name_lower_case: Joi.string().required(),
  });
  let isValidate = userSchema.validate(user, response);
  if (isValidate.error)
    return validationErrorResponse(isValidate.error);
  return promise.resolve(user);
}
/**
 * @author Kamal Bhera
 * @description Validate the key's of update Tags request body which is coming from the request.
 * @param {*} user Its request body of Tags
 * @param {*} response Its response
 * @returns 
 */
function validateUpdateTags(user, response) {
  const userSchema = Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required(),
    name_lower_case: Joi.string().required()
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

