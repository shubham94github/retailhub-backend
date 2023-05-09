'use strict'
var path = require('path')
// var auth = require('../configuration/authentication');

/**
 * @description This function is used for create all admin related api
 * We can add and call the middleware function by auth variable
 */
module.exports = function (app) {
  var TagController = require(path.join('../controllers/tags.controller'))
  app.get('/api/tags', TagController.index)
  app.post('/api/tag/create', TagController.create)
  app.put('/api/tag/update', TagController.update)
  app.delete('/api/tag/remove/:id', TagController.destroy)
}
