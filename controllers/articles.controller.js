'use strict';
const db = require("../app/models");
const Sequelize = require('sequelize');
const responseHelper = require('../helpers/responseHelper.js');
const ArticleValidator = require('../helpers/validators/article.validator');
const Op = Sequelize.Op;
const _ = require('lodash');
const listLimit = 5;
const config = require('../configuration/config');
let pathUrl = config.get('filePathUrl');
const { articleMessages } = require('../helpers/message');
const ArticleService = require('../services/article.services');

exports.getArticlesByStartup = getArticlesByStartup;
exports.createArticle = createArticle;
exports.updateArticle = updateArticle;
exports.getArticles = getArticles;
exports.getArticleListByTagName = getArticleListByTagName;
exports.removeArticle = removeArticle;


/**
 * @description This function get article list for admin and subadmin
 * @method  getArticles
 * @url /api/articles/:id
 */
function getArticlesByStartup(request, response, next) {
    var handleError = responseHelper.createErrorHandler(request, response, next);
    var sendResponse = responseHelper.createResponseHandler(request, response, 200);
    const startupId = request.params.id;
    return ArticleService.getArticlesByStartupService(startupId)
        .then((result) => { return { data: result?.length ? result : [], message: 'Article list' } })
        .then(sendResponse)
        .catch(handleError)
}

/**
 * @description This function get article list for admin and subadmin
 * @method  getArticles
 * @url /api/articles
 */
function getArticles(request, response, next) {
    var handleError = responseHelper.createErrorHandler(request, response, next);
    var sendResponse = responseHelper.createResponseHandler(request, response, 200);
    return ArticleService.getArticlesService(request)
        .then((result) => { return { data: result?.length ? result : [], message: 'All articles list' } })
        .then(sendResponse)
        .catch(handleError)
}

/**
 * @description This function use to create new client by admin and subadmin
 * @method createArticle
 * @url api/create/article
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
function createArticle(request, response, next) {
    var handleError = responseHelper.createErrorHandler(request, response, next);
    var sendResponse = responseHelper.createResponseHandler(request, response, 200);
    var article = request.body;
    if (request?.file?.filename) article.image_name = pathUrl + '/' + request?.file?.filename;
    return ArticleValidator.validateCreateArticle(article, response)
        .then(createArticleObject)
        .then(ArticleService.createArticleService)
        .then((result)=> ArticleService.addArticleTag(article.tagIds, result.id))
        .then(createdArticleResponse)
        .then(sendResponse)
        .catch(handleError)
}
/**
 * @param {*} user 
 * @returns Create user detail in sql database
 */
async function createArticleObject(article) {
    return {
        title: article.title,
        description: article.description,
        body: article.body,
        date: article.date,
        start_up_id: article.start_up_id,
        isdeleted: false,
        area_interest: JSON.parse(article.area_interest),
        articles_link: article.articles_link,
        imagedata: null,
        image_name: article.image_name,
        image_type: null,
        restricted: '00'
    }
}
/**
 * @param {*} createdArticleResponse 
 * @returns Create createdArticleResponse detail in sql database
 */
function createdArticleResponse(article) {
    if (!article) throw { type: responseHelper.REQUEST_NOT_COMPLETE, message: articleMessages.SOMETHING_WRONG }
    article = {
        title: article.title,
        description: article.description,
        body: article.body,
        date: article.date,
        start_up_id: article.start_up_id,
        tags: article.tags,
        isdeleted: false,
        area_interest: article.area_interest,
        articles_link: article.articles_link,
        imagedata: null,
        image_name: article.image_name,
    }
    return {
        message: articleMessages.NEW_ARTICLE_CREATED,
        data: article
    }
}

/**
 * @description This function use to update article by admin and subadmin
 * @method updateArticle
 * @url api/update/article
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
async function updateArticle(request, response, next) {
    var handleError = responseHelper.createErrorHandler(request, response, next);
    var sendResponse = responseHelper.createResponseHandler(request, response, 200);
    const tagIds = request.body.tagIds
    const updatedArticle = request.body;
    updatedArticle.area_interest = JSON.parse(request.body.area_interest)
    await ArticleService.removeArticleTag(updatedArticle.id)
    if (request?.file?.filename) updatedArticle.image_name = pathUrl + '/' + request?.file?.filename;
    return ArticleValidator.validateUpdateArticle(updatedArticle, response)
        .then(ArticleService.editArticleService)
        .then(ArticleService.getUpdateArticleObject(updatedArticle))
        .then(updatedByArticleId())
        .then(ArticleService.addArticleTag(tagIds, updatedArticle.id))
        .then((result) => { return { data: result, message: articleMessages.ARTICLE_UPDATED } })
        .then(sendResponse)
        .catch(handleError)
}

function updatedByArticleId() {
    return function ([updatedObject, createdArticle]) {
        return createdArticle.update(updatedObject);
    }
}

/**
 * @description This function use to get articles and subadmin list by admin and subadmin with pagination filter
 * @method getArticleListByTagName
 * @url /api/articles/:tag
 */
function getArticleListByTagName(request, response, next) {
    var handleError = responseHelper.createErrorHandler(request, response, next);
    var sendResponse = responseHelper.createResponseHandler(request, response, 200);
    const names = request.params.names;
    return ArticleService.getArticlebyTagName(names)
        .then(sendResponse)
        .catch(handleError)
}

/**
 * @description This function only admin can remove client and sub admin
 * @method removeArticle
 * @url removeArticle
 */
function removeArticle(request, response, next) {
    var handleError = responseHelper.createErrorHandler(request, response, next);
    var sendResponse = responseHelper.createResponseHandler(request, response, 200);
    const articleId = request.params.id;
    return ArticleService.destroy(articleId)
        .then(deletedArticleResponse)
        .then(sendResponse)
        .catch(handleError)
}

function deletedArticleResponse(article) {
    if (article?.isdeleted) return { message: articleMessages.ARTICLE_DELETED }
    throw { type: responseHelper.REQUEST_NOT_COMPLETE, message: articleMessages.SOMETHING_WRONG }
}
