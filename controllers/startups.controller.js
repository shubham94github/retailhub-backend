"use strict";
const fs = require("fs");
const responseHelper = require("../helpers/responseHelper.js");
const ArticleValidator = require("../helpers/validators/article.validator");
const StartupValidator = require("../helpers/validators/startup.validator");
const config = require("../configuration/config");
const { Promise } = require("bluebird");
let pathUrl = config.get("filePathUrl");
const { startupMessages } = require("../helpers/message");
const StartupService = require("../services/startup.services");
let emailService = require("../services/email.service");
let chatgpt = require("../services/chatgpt.service");
let templateService = require("../services/template.service");
const UserService = require("../services/user.services");
const db = require("../app/models");
const StartupForm = db.startup_forms;
var csv = require("csv-express");
const { Parser } = require("json2csv");
exports.getStartups = getStartups;
exports.createStartup = createStartup;
exports.createStartupSubmitForm = createStartupSubmitForm;
exports.getStartupByName = getStartupByName;
exports.getStartupById = getStartupById;
exports.destroy = destroy;
exports.getStartupsForm = getStartupsForm;
exports.downloadStartupCSV = downloadStartupCSV;
exports.genrateChatgptStartupList = genrateChatgptStartupList;

/**
 * @description This function get startup list for admin and subadmin
 * @method  getStartups
 * @url /api/startups
 */
function getStartups(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(
    request,
    response,
    200
  );
  return StartupService.getStartupsService(request, response)
    .then(createStartupsResponse)
    .then((result) => {
      return { data: result };
    })
    .then(sendResponse)
    .catch(handleError);
}
/**
 * @description This function use to make startups response
 * @function  createStartupsResponse
 */
function createStartupsResponse(statupsList) {
  if (!statupsList || !statupsList?.rows.length)
    return { startups: [], count: 0, message: "Not found startups list" };
  return {
    startups: statupsList?.rows,
    count: statupsList?.count,
    message: "All startups list"
  };
}
/**
 * @description This function use to create new client by admin and subadmin
 * @method createStartup
 * @url api/create/article
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
function createStartup(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(
    request,
    response,
    200
  );
  var article = request.body;
  if (request?.file?.filename)
    article.image_name = pathUrl + "/" + request?.file?.filename;
  return ArticleValidator.validateCreateArticle(article, response)
    .then(createStartupObject)
    .then(StartupService.store)
    .then((result) => StartupService.addArticleTag(article.tagIds, result.id))
    .then(createdStartupResponse)
    .then(sendResponse)
    .catch(handleError);
}
/**
 * @param {*} startup
 * @returns Create startup detail in sql database
 */
async function createStartupObject(startup) {
  return {
    brand_name: startup.title,
    is_company: startup.description,
    email_domain: startup.body,
    company_type: startup.date,
    company_short_name: startup.start_up_id,
    company_legal_name: startup.tags,
    is_deleted: false
  };
}
/**
 * @param {*} createdStartupResponse
 * @returns Create createdStartupResponse detail in sql database
 */
function createdStartupResponse(startup) {
  if (!startup)
    throw {
      type: responseHelper.REQUEST_NOT_COMPLETE,
      message: startupMessages.SOMETHING_WRONG
    };
  startup = {
    brand_name: startup.title,
    is_company: startup.description,
    email_domain: startup.body,
    company_type: startup.date,
    company_short_name: startup.start_up_id,
    company_legal_name: startup.tags,
    is_deleted: false
  };
  return { message: startupMessages.NEW_STARTUP_CREATED, data: startup };
}

/**
 * @description This function use to create startup submit form to admin and subadmin
 * @method createStartupSubmitForm
 * @url api/startup/submit-form
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
function createStartupSubmitForm(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(
    request,
    response,
    200
  );
  var startup = request.body;
  if (request?.file?.filename)
    startup.image_src = pathUrl + "/" + request?.file?.filename;
  return StartupValidator.validateCreateStartupForm(startup, response)
    .then(StartupService.storeForm)
    .then(sendVerificationEmail)
    .then(sendResponse)
    .catch((e) => {
      console.log("e", e);
    });
}

/**
 * @description This function use to get startup and users list by admin and subadmin
 * @method getStartupByName
 * @url /api/startup/:name
 */
function getStartupByName(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(
    request,
    response,
    200
  );
  const name = request.params.name;
  return StartupService.getStartupByName(name.split("-").join(" "))
    .then(sendResponse)
    .catch(handleError);
}
/**
 * @description This function use to get startup and users list by admin and subadmin
 * @method getStartupById
 * @url /api/startup/:id
 */
function getStartupById(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(
    request,
    response,
    200
  );
  const id = request.params.id;
  return StartupService.getStartupById(id)
    .then(sendResponse)
    .catch(handleError);
}
/**
 * @description This function only admin can remove startups
 * @method destroy
 * @url /api/startup/destroy
 */
function destroy(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(
    request,
    response,
    200
  );
  const startupId = request.params.id;
  return StartupService.destroy(startupId)
    .then(deletedStartupResponse)
    .then(sendResponse)
    .catch(handleError);
}

function deletedStartupResponse(startup) {
  if (startup?.is_deleted) return { message: startupMessages.STARTUP_DELETED };
  throw {
    type: responseHelper.REQUEST_NOT_COMPLETE,
    message: startupMessages.SOMETHING_WRONG
  };
}

/**
 * @param {*} response
 * @returns Send Email verification link
 */
async function sendVerificationEmail(data) {
  if (!data) return data;
  let user_emails = await UserService.findAllAdmin();
  await Promise.mapSeries(user_emails, async (user) => {
    templateService
      .startupFormSubmission(user.email, data)
      .then(emailService.sendEmail);
  });
  return data;
}

/**
 * @description This function get startup list for admin and subadmin
 * @method  getStartupsForm
 * @url /api/startups/form
 */
function getStartupsForm(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(
    request,
    response,
    200
  );
  return StartupService.getStartupsForm(request, response)
    .then(createStartupsFormResponse)
    .then((result) => {
      return { data: result };
    })
    .then(sendResponse)
    .catch(handleError);
}
/**
 * @description This function get startup list for admin and subadmin
 * @method  genrateChatgptStartupList
 * @url /api/startup/get-chatgpt-startup
 */
function genrateChatgptStartupList(request, response, next) {
  var handleError = responseHelper.createErrorHandler(request, response, next);
  var sendResponse = responseHelper.createResponseHandler(
    request,
    response,
    200
  );
  const mission = request.body.mission;
  return chatgpt
    .askChatGPT(
      `list me 10 startups with website url  in json array with key name ,url and status=false that provide: ${mission} `
    )
    .then((result) => {
      return { startups: JSON.parse(result) };
    })
    .then(sendResponse)
    .catch(handleError);
}

/**
 * @description This function use to make startups response
 * @function  createStartupsFormResponse
 */
function createStartupsFormResponse(statupsList) {
  if (!statupsList || !statupsList?.rows.length)
    return { startups: [], count: 0, message: "Not found startups form list" };
  return {
    startups: statupsList?.rows,
    count: statupsList?.count,
    message: "All startups form list"
  };
}

/**
 * @description This function use to DOWNLOAD downloadStartupCSV startups response
 * @function  downloadStartupCSV
 */
async function downloadStartupCSV(request, response) {
  var filename = "products.csv";
  var dataArray;
  let data = await StartupForm.findAll();
  // response.statusCode = 200;
  // response.setHeader('Content-Type', 'text/csv');
  // response.setHeader("Content-Disposition", 'attachment; filename='+filename);
  // return response.csv(products, true);
  const fields = [
    { label: "Name", value: "name" },
    { label: "stage", value: "stage" },
    { label: "Funding Amount", value: "funding_amount" },
    { label: "Business model", value: "business_model" },
    { label: "Customer count", value: "customer_count" },
    { label: "Description", value: "description" },
    { label: "Contact Name", value: "contact_name" },
    { label: "Contact Email", value: "contact_email" },
    { label: "Phone Number", value: "phone_number" }
  ];
  // return downloadResource(res, 'users.csv', fields, data);
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);
  response.header("Content-Type", "text/csv");
  response.attachment(filename);
  return response.send(csv);
}

// export const downloadResource = (res, fileName, fields, data) => {
//     const json2csv = new Parser({ fields });
//     const csv = json2csv.parse(data);
//     res.header('Content-Type', 'text/csv');
//     res.attachment(fileName);
//     return res.send(csv);
//   }
