'use strict';
let promise = require('bluebird');
let bcrypt = require('bcrypt');
let responseHelper = require('../helpers/responseHelper.js');
let auth = require('../configuration/authentication');
const { userMessages } = require('../helpers/message');
const UserValidator = require('../helpers/validators/user.validator');
let linkService = require('../services/link.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const UserService = require('../services/user.services')
let emailService = require('../services/email.service');
let templateService = require('../services/template.service');
const { EMAIL_VERIFICATION_TYPE } = require('../helpers/constants');
const { generateRandomPassword } = require('../services/controller.service');
const moment = require("moment");
/**
 * @description In This file we have to create only user related logic function
 */
exports.createUser = createUser;
exports.userLogin = userLogin;
exports.createUserDetail = createUserDetail;
exports.verifyUser = verifyUser;
exports.forgetPassword = forgetPassword;
exports.resetPassword = resetPassword;
exports.updatePassword = updatePassword;
exports.resendVerification = resendVerification;
exports.userUpdateProfile = userUpdateProfile;

/**
 * @description Create user Function 
 * @method createUser
 * @url /signup 
 * @returns 
 */
function createUser(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(request, response, 200);
  var user = request.body;
  return UserValidator.validateCreateUser(user, response)
    .then(checkIsLinkedin)
    .then(createUserObject)
    .then(updateUserPasswordInHash)
    .then(createUserDetail)
    .then(responseOnCreatedUser)
    .then(sendResponse)
    .catch(handleError);
}
/**
 * @description Create Response message if user checkIsLinkedin
 * @param {*} response 
 * @returns 
 */
function checkIsLinkedin(user) {
  if(!user.isLinkedinUser && !user.password) return promise.reject(responseHelper.wrapValidationError({ password: ['Password can\'t be blank'] }));
  return user
}
/**
 * @param {*} user 
 * @returns Create user detail in sql database
 */
 async function createUserObject(user) {
  var password = generateRandomPassword();
  return {
    first_name: user.firstName,
    last_name: user.lastName,
    full_name: user.firstName + ' ' + user.lastName,
    email: user.email,
    phone_number: user.phoneNumber,
    password: user.password ? user.password : password,
    is_linkedin_user: user.isLinkedinUser
  }
}
/**
 * @param {*} user 
 * @returns Create user detail in sql database
 */
async function createUserDetail(user) {
  let checkByEmail = await UserService.findOneByEmail(user);
  if (checkByEmail && !checkByEmail?.is_deleted) throw { type: responseHelper.DUPLICATE_ERROR_KEY, message: userMessages.USER_ALREADY_REGISTERED }
  return UserService.store(user);
}

/**
 * @description Create Response message if user created
 * @param {*} response 
 * @returns 
 */
function responseOnCreatedUser(response) {
  let userObject = {
    id: response.id,
    email: response.email,
    name: response?.first_name + ' ' + response?.last_name,
    first_name: response?.first_name,
    last_name: response?.last_name,
    phone_number: response?.phone_number,
    is_linkedin_user: response?.is_linkedin_user,
    createdAt: response.createdAt,
    isVerified: response.is_verified,
  }
  return {
    message: response?.id ? userMessages.USER_CREATED : userMessages.USER_NOT_CREATED,
    user: response?.id ? userObject : {},
  }
}

/**
 * @description This method encrypted password to save encrypted password in database
 * @param {*} password 
 * @returns 
 */
async function updateUserPasswordInHash(user) {
  if (!user.password) return promise.reject(responseHelper.wrapValidationError({ password: ['Password can\'t be blank'] }));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt)
  return user;
}

/**
 * @description This function use for user login 
 * @method userLogin
 * @url /login
 * @returns 
 */
function userLogin(request, response, next) {
  var user = request.body;
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(request, response, 200);
  return checkUserIsValid(user)
    .then(generateUserAuthToken)
    .then((userToken) => {
      return {
        message: userMessages.USER_LOGGEDIN,
        data: { token: auth.createJWTToken(userToken), user: userToken }
      }
    })
    .then(sendResponse)
    .catch(handleError)
}

/**
 * @description Check logged in user is valid or not
 * @param {*} user 
 * @returns 
 */
function checkUserIsValid(user) {
  return UserService.findOneByEmail(user)
    .then(matchPassword(user))
}

/**
 * @description match password by encrypt the request body password by same secret key and match with database 
 * @param {*} user 
 * @returns 
 */
function matchPassword(user) {
  return async function (userDetail) {
    if (!userDetail) throw { type: responseHelper.NOT_FOUND_ERROR_KEY, message: userMessages.NOT_REGISTERED }
    if (userDetail?.is_blocked) throw { type: responseHelper.NOT_AUTHORIZED_ERROR_KEY, message: userMessages.USER_BLOCKED }
    if (!userDetail.is_verified) throw { type: responseHelper.NOT_AUTHORIZED_ERROR_KEY, message: userMessages.USER_NOT_VERIFIED, data: { isVerify: false } }
    if (!userDetail.is_linkedin_user) {
      let isValid = await isValidPassword(user.password, userDetail.password);
      if (!isValid) throw { type: responseHelper.NOT_FOUND_ERROR_KEY, message: userMessages.PASSWORD_NOT_MATCH }
    }
    return userDetail;
  }
}

/**
 * @description Compare the logged in user password with database password
 * @param {*} password 
 * @param {*} hash 
 * @returns 
 */
async function isValidPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * @descript Generate User authentication token using jwt and insided the token we can add user details field.
 * @param {*} userDetail 
 * @returns 
 */
async function generateUserAuthToken(userDetail) {
  if (!userDetail) throw { type: responseHelper.REQUEST_NOT_COMPLETE, message: userMessages.INVALID_USER_TYPE }
  let userTokenObject = {
    id: userDetail.id,
    email: userDetail.email,
    name: userDetail?.first_name + ' ' + userDetail?.last_name,
    first_name: userDetail?.first_name,
    last_name: userDetail?.last_name,
    phone_number: userDetail?.phone_number,
    is_linkedin_user: userDetail?.is_linkedin_user,
    createdAt: userDetail.createdAt,
    isVerified: userDetail.is_verified,
  }
  return userTokenObject;
}


/**
 * @description This controller use to send mail for forget password
 * @method forgetPassword
 * @url /user/forgetPassword
 */
 function forgetPassword(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(request, response, 200);
  let email = request.params && request.params.email;
  const user = { email: email}
  return UserService.findOneByEmail(user)
    .then(checkUserEmailIsValid)
    .then(linkService.createForgetPasswordVerificationLink(EMAIL_VERIFICATION_TYPE.RESET_PASSWORD))
    .then(sendVerificationEmail)
    .then(UserService.updateForgetpasswordCode)
    .then(forgetPasswordResponse)
    .then(sendResponse)
    .catch(handleError)
}

function checkUserEmailIsValid(user) {
  if (!user) throw { type: responseHelper.NOT_FOUND_ERROR_KEY, message: userMessages.NOT_REGISTERED }
  return user;
}

function forgetPasswordResponse(response) {
  return {
    message: response?.reset_password_code ? userMessages.FORGET_PASSWORD_LINK : userMessages.EMAIL_NOT_MATCH,
    link: `/reset/password/${response?.reset_password_code}/${EMAIL_VERIFICATION_TYPE.RESET_PASSWORD}`,
  }
}


/**
 * @description This function is use for update current password if user know old password
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */

function updatePassword(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(request, response, 200);
  let user = request.user;
  let validatePassword = {
    oldPassword: request.body.oldPassword,
    password: request.body.newPassword
  }
  return UserValidator.validateResetPassword(validatePassword, response)
    .then(checkOldPasswordAndUpdateNewPassword(user))
    .then(passwordUpdatedResponse)
    .then(sendResponse)
    .catch(handleError)
}

function checkOldPasswordAndUpdateNewPassword(user) {
  return function (validatedPassword) {
    let oldPasswordObject = { password: validatedPassword.oldPassword }
    return UserService.findOne(user.id)
      .then(matchPassword(oldPasswordObject))
      .then(updateNewPassword(validatedPassword))
  }
}


function updateNewPassword(validatedPassword) {
  return async function (createdUser) {
    validatedPassword = await updateUserPasswordInHash(validatedPassword);
    return createdUser.update({ password: validatedPassword.password })
  }
}

function passwordUpdatedResponse(user) {
  if (user) return { success: true, message: userMessages.PASSWORD_UPDATED }
  throw { type: responseHelper.REQUEST_NOT_COMPLETE, message: userMessages.SOMETHING_WRONG }
}

/**
 * @description Create function to verify user verification link.
 */
function verifyUser(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(request, response, 200);
  let query = {
    uuid: request.query.id,
    type: request.query.type
  }
  return UserService.findOneVerification(query)
    .then(updateUserVerification)
    .then(sendResponse)
    .catch(handleError)
}

/**
 * @param verificationData
 * @description Update user vierification filed if verification link is valid. 
 */
function updateUserVerification(verificationData) {
  if (!verificationData) throw { type: responseHelper.NOT_FOUND_ERROR_KEY, message: userMessages.INVALID_VERIFICATION_LINK }
  return UserService.findOne(verificationData.user_id)
    .then((user) => user.update({ is_verified: true }))
    .then((user) => verificationData.update({ is_active: false }) && user)
    .then(userUpdatedResponse)
}

function userUpdatedResponse(user) {
  if (user?.is_verified) return { message: userMessages.VERIFICATION_LINK_VERIFIED, data: { isVerified: true } }
  throw { type: responseHelper.REQUEST_NOT_COMPLETE, message: userMessages.INVALID_VERIFICATION_LINK }
}

/**
 * @param {*} user 
 * @returns Update user password and verification by reset passowrd link
 */
function updatePasswordVerification(query) {
  return async function (user) {
    if (!user) throw { type: responseHelper.NOT_FOUND_ERROR_KEY, message: userMessages.INVALID_VERIFICATION_LINK }
    user.password = query.password;
    return updateUserPasswordInHash(user)
      .then((updatedUser) => user.update({ password: updatedUser.password }))
      .then(() => user.update({ reset_password_code: null, reset_password_requested_on: null }))
      .then(userPasswordUpdatedResponse)
  }
}

function userPasswordUpdatedResponse(user) {
  if (!user?.reset_password_code) return { message: userMessages.PASSWORD_RESET }
  throw { type: responseHelper.REQUEST_NOT_COMPLETE, message: userMessages.INVALID_VERIFICATION_LINK }
}

/**
 * @description Reset password on verificaiton link base
 */
function resetPassword(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(request, response, 200);
  let query = {
    uuid: request.query.id,
    type: request.query.type,
    password: request.body.password
  }
  return UserValidator.validateResetPassword(query, response)
    .then(UserService.findOnebByCode)
    .then(updatePasswordVerification(query))
    .then(sendResponse)
    .catch(handleError)
}

/**
 * @description Create resend verification function
 */
function resendVerification(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(request, response, 200);
  let email = request.params && request.params.email;
  const user = {email: email}
  return UserService.findOneByEmail(user)
    .then(checkUserEmailIsValid)
    .then(linkService.createEmailVerificationLink(EMAIL_VERIFICATION_TYPE.RESEND_VERIFICATION))
    .then(sendVerificationEmail)
    .then(UserService.verificationCreate)
    .then(resendVerificationResponse)
    .then(sendResponse)
    .catch(handleError)
}

function resendVerificationResponse(response) {
  return {
    message: response?.user_id ? userMessages.RESEND_VERIFICATION : userMessages.INVALID_VERIFICATION_LINK,
  }
}


/**
 * @param {*} response 
 * @returns Send Email verification link
 */
 function sendVerificationEmail(data) {
  templateService.createMessageForEmailVerification(data)
    .then(emailService.sendEmail)
  return {
    email_type: data.linkType,
    account_verification_code: data.uuid,
    verification_link: data.verificationLink,
    user_id: data.id,
    link_expiry_time: moment(new Date()).add(60, 'm').toDate()
  }
}

/**
 * @description this method logged in user can update his profile
 * @method userUpdateProfile
 * @url /update/profile
 */
function userUpdateProfile(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(request, response, 200);
  let user = request.user;
  let body = request.body;
  return UserService.findOne(user.id)
    .then(getUpdateUserObject(body))
    .then(([updatedObject, createdUser]) => createdUser.update(updatedObject))
    .then(updateProfileResponse)
    .then(sendResponse)
    .catch(handleError)
}

function getUpdateUserObject(body) {
  return async function (createdUser) {
    if (!createdUser) throw { type: responseHelper.NOT_FOUND_ERROR_KEY, message: userMessages.USER_NOT_FOUND }
    let updatedObject = {
      first_name: body?.first_name ? body.first_name : createdUser.first_name,
      last_name: body?.last_name ? body.last_name : createdUser.last_name,
      full_name: body?.first_name + ' ' + body?.last_name,
      email: body?.email ? await checkEmailAlreadyUsed(createdUser, body.email) : createdUser.email,
      phone_number: body?.phone_number ? body.phone_number : createdUser.phone_number,
    }
    return [updatedObject, createdUser]
  }
}

function checkEmailAlreadyUsed(createdUser, email) {
  if (createdUser.email == email) return email;
  const emailObj = {email: email}
  return UserService.findOneByEmail(emailObj)
    .then((user) => {
      if (user) throw { type: responseHelper.DUPLICATE_ERROR_KEY, message: userMessages.EMAIL_ALREADY_USED }
      return email;
    })
}

function updateProfileResponse(user) {
  let userObject = {
    id: user.id,
    email: user.email,
    name: user?.first_name + ' ' + user?.last_name,
    first_name: user?.first_name,
    last_name: user?.last_name,
    phone_number: user?.phone_number,
    createdAt: user.createdAt,
    is_linkedin_user: user.is_linkedin_user,
    isVerified: user.is_verified,
  }
  return { message: userMessages.USER_PROFILE_UPDATED, data: userObject }
}