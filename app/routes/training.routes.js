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

module.exports = app => {
    const training = require("../controllers/training.controller.js");
    var router = require("express").Router();
     
    router.post("/",upload.single("imgur"),training.createTraining);
    router.put("/update/:id",upload.single("imgur"),training.updateTraining);
    router.delete("/:id",training.deleteTraining);
    router.get("/",training.findAll);

    app.use("/api/training", router);
}