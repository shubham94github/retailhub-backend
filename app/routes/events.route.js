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
    const events = require("../controllers/events.controller.js");
    var router = require("express").Router();
     
    router.post("/",upload.single("imgur"),events.createEvent);
    router.put("/update/:id",upload.single("imgur"),events.updateEvent);
    router.delete("/:id",events.deleteEvent);
    router.get("/",events.findAll);

    app.use("/api/events", router);
}