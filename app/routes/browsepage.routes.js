
var router = require("express").Router();
module.exports = app => {
    const browsepage = require("../controllers/browsepage.controller.js");

  router.post('/all',browsepage.all);

    app.use("/api/browse", router);
}