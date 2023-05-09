'use strict';

const Joi = require('joi');
var responseHelper = require('../responseHelper');
var promise = require('bluebird');


exports.validateCreateArticle = validateCreateArticle;
exports.validateUpdateArticle = validateUpdateArticle;

/**
 * @author Kamal Bhera
 * @description Validate the key's of create user request body which is coming from the request.
 * @param {*} user Its request body of user
 * @param {*} response Its response
 * @returns 
 */
function validateCreateArticle(user, response) {
  const userSchema = Joi.object().keys({
    title: Joi.string().required(),
    start_up_id: Joi.string().required(),
    user_id: Joi.string().required(),
    body: Joi.string().required(),
    date: Joi.string(),
    description: Joi.string().required(),
    articles_link: Joi.string(),
    area_interest: Joi.string(),
    image_name: Joi.string(),
    tagIds: Joi.string(),
  });
  let isValidate = userSchema.validate(user, response);
  if (isValidate.error)
    return validationErrorResponse(isValidate.error);
  return promise.resolve(user);
}
/**
 * @author Kamal Bhera
 * @description Validate the key's of update article request body which is coming from the request.
 * @param {*} user Its request body of article
 * @param {*} response Its response
 * @returns 
 */
function validateUpdateArticle(user, response) {
  const userSchema = Joi.object().keys({
    id: Joi.string().required(),
    title: Joi.string().required(),
    start_up_id: Joi.string().required(),
    user_id: Joi.string().required(),
    body: Joi.string(),
    date: Joi.string(),
    description: Joi.string(),
    articles_link: Joi.string(),
    tagIds: Joi.string(),
    area_interest: Joi.array(),
    image_name: Joi.string(),
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

