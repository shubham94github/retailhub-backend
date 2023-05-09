'use strict';
var path = require('path');
// var auth = require('../configuration/authentication');
var { upload } = require("../services/controller.service");

/**
 * @description This function is used for create all admin related api 
 * We can add and call the middleware function by auth variable 
 */
module.exports = function (app) {
  var ArticleController = require(path.join('../controllers/articles.controller'));
  app.get('/api/articles/:id', ArticleController.getArticlesByStartup)
  app.post('/api/create/article', upload.single('article_image'), ArticleController.createArticle)
  app.get('/api/articles', ArticleController.getArticles)
  app.put('/api/update/article', upload.single('article_image'), ArticleController.updateArticle)
  app.get('/api/articles/tags/:names', ArticleController.getArticleListByTagName)
  app.delete('/api/article/remove/:id', ArticleController.removeArticle)

}