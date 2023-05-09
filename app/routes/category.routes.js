const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');

app.use(bodyParser.json());
//upload image
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'upload/images');
  },

  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


var upload = multer({ storage: storage })
//end upload image

module.exports = app => {
    const category = require("../controllers/category.controller.js");
    const { body, validationResult } = require('express-validator');
    var router = require("express").Router();
  
    // Create a new category table

    router.post("/create",upload.array('image_name',2),
  category.create);

  // router.post("/create",category.create);
// get category
router.get("/findall", category.findAll);
//delete category(update is_deleted = true)
router.put("/delete/:id",category.deleteCategory);
    app.use("/api/category", router);
  };
  
  // body('child_header').notEmpty().withMessage('please enter title or is unique'),
  // body('is_custom').notEmpty().withMessage('please enter description'),
  