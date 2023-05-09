module.exports = app => {
    const retailers = require("../controllers/retailer.controller.js");
    var router = require("express").Router();
// NEW  
router.post("/status/block/:id",retailers.retailerblock);
//Update retail  
router.post("/status/unblock/:id",retailers.retailerunblock);
//Get retailer
router.get("/getall",retailers.getall);
//Get count of retailer
router.get("/get_count_of_retailer",retailers.getCountOfRetailer);

//Get retailer
router.get("/find_one/:id",retailers.findOne);


    app.use("/api/retailer", router);
  };