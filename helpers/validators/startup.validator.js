'use strict';

const Joi = require('joi');
var responseHelper = require('../responseHelper');
var promise = require('bluebird');


exports.validateCreateStartupForm = validateCreateStartupForm;

/**
 * @author Kamal Bhera
 * @description Validate the key's of create startup request body which is coming from the request.
 * @param {*} user Its request body of user
 * @param {*} response Its response
 * @returns 
 */
function validateCreateStartupForm(user, response) {
  const userSchema = Joi.object().keys({
    name: Joi.string().required(),
    stage: Joi.string().required(),
    hq_country_id: Joi.string().required(),
    funding_amount: Joi.string().required(),
    business_model: Joi.string(),
    description: Joi.string().required(),
    customer_count: Joi.string(),
    area_interest: Joi.string(),
    image_src: Joi.string(),
    contact_name: Joi.string(),
    contact_email: Joi.string(),
    job_title: Joi.string(),
    phone_number: Joi.string(),
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

