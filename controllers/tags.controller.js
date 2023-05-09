'use strict'
const responseHelper = require('../helpers/responseHelper.js')
const { tagMessages } = require('../helpers/message')
const TagsValidator = require('../helpers/validators/tag.validator')
const TagService = require('../services/tag.services')

exports.index = index
exports.create = create
exports.update = update
// exports.index = index
exports.destroy = destroy

/**
 * @description This function get tag list for admin and subadmin
 * @method  index
 * @url /api/tags
 */
function index (request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next)
  var sendResponse = responseHelper.createResponseHandler( request, response, 200)
  return TagService.getTags()
    .then(result => { return { data: result?.length ? result : [], message: 'All tags list' } })
    .then(sendResponse)
    .catch(handleError)
}

/**
 * @description This function use to create new tag by admin and subadmin
 * @method create
 * @url api/tag/create
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
function create (request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next)
  var sendResponse = responseHelper.createResponseHandler(request, response, 200)
  var tag = request.body
  return TagsValidator.validateCreateTags(tag, response)
    .then(createTagObject)
    .then(TagService.createTags)
    .then(createdTagResponse)
    .then(sendResponse)
    .catch(handleError)
}
/**
 * @param {*} tag
 * @returns Create tag detail in sql database
 */
async function createTagObject (tag) {
  return {
    name: tag.name,
    name_lower_case: tag.name_lower_case
  }
}
/**
 * @param {*} createdTagResponse
 * @returns Create createdTagResponse detail in sql database
 */
function createdTagResponse (tag) {
  if (!tag)
    throw { type: responseHelper.REQUEST_NOT_COMPLETE, message: tagMessages.SOMETHING_WRONG }
  tag = {
    id: tag.id,
    name: tag.name,
    name_lower_case: tag.name_lower_case
  }
  return {
    message: tagMessages.NEW_TAGS_CREATED,
    data: tag
  }
}

/**
 * @description This function use to update tag by admin and subadmin
 * @method update
 * @url api/tag/update
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
function update (request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next)
  var sendResponse = responseHelper.createResponseHandler(request, response, 200)
  let updatedTag = request.body
  return TagsValidator.validateUpdateTags(updatedTag, response)
    .then(TagService.updateTags)
    .then(getUpdateTagObject(updatedTag))
    .then(updatedByTagId())
    .then(updatedTag => {
      return { data: updatedTag, message: tagMessages.TAGS_UPDATED }
    })
    .then(sendResponse)
    .catch(handleError)
}
/**
 * @param {*} getUpdateTagObject
 * @returns update getUpdateTagObject detail in sql database
 */
 function getUpdateTagObject(body) {
  return async function (createdTag) {
    if (!createdTag) throw { type: responseHelper.NOT_FOUND_ERROR_KEY, message: tagMessages.TAGS_NOT_FOUND }
    let updatedObject = {
      name: body?.name ? body.name : createdTag.name,
      name_lower_case: body?.name_lower_case ? body.name_lower_case : createdTag.name_lower_case,
    }
    return [updatedObject, createdTag]
  }
} 
/**
 * @param {*} updatedByTagId
 * @returns update updatedByTagId detail in sql database
 */
function updatedByTagId () {
  return function ([updatedObject, createdTag]) {
    return createdTag.update(updatedObject)
  }
}

/**
 * @description This function only admin can remove client and sub admin
 * @method destroy
 * @url destroy
 */
function destroy (request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next)
  var sendResponse = responseHelper.createResponseHandler( request, response, 200)
  const tagId = request.params.id
  return TagService.destroyTag(tagId)
    .then(deletedTagResponse)
    .then(sendResponse)
    .catch(handleError)
}

function deletedTagResponse (tag) {
  if (tag) return { message: tagMessages.TAGS_DELETED }
  throw {
    type: responseHelper.REQUEST_NOT_COMPLETE,
    message: tagMessages.SOMETHING_WRONG
  }
}
