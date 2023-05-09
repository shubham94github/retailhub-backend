// const multer = require('multer');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
const { tags } = require('../models');

app.use(bodyParser.json());



//upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/api/images');
  },

  filename: function (req, file, cb) {
    console.log("REQ+" + req + " FILE" + file)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage })
//end upload imag
module.exports = app => {
  const articles = require("../controllers/articles.controller");
  const { body, validationResult } = require('express-validator');
  var router = require("express").Router();

  router.get("/:id", articles.articles);
  router.get("/", articles.all_articles);
  router.get("/tag/:id", articles.articles_by_tagname);
  router.put("/delete/:id", articles.delete_articles);
  router.post('/genrateArticles/', articles.genrateArticle)
  router.post("/", upload.single('image'),
    body('body').notEmpty().withMessage('please enter body'),
    body('date').notEmpty().withMessage('please enter date'),
    body('description').notEmpty().withMessage('please enter description'),
    body('link').notEmpty().withMessage('please enter articles link'),
    body('title').notEmpty().withMessage('please enter title'),

    articles.insert_articles);
  //update articles area of interest by articles id 
  router.put("/interest/:id", articles.updateInterest),
    //update articles tags by articles id 
    router.put("/updatetag/:id", articles.updateTags)

  //update articles by id
  router.put("/update/:id", upload.single('image'), articles.update);
  // Filter Article remain
  router.post("/filterArticle/", articles.filterArticle);
  //  Download article image
  router.get("/downloadImage/:id", articles.downloadImage);
  //find article which has event tags
  router.get("/tags/event", articles.event_tags);
  //find article which has event tags
  router.get("/tags/training", articles.training_tags);

  app.use("/api/v1/startup/article", router);
};



