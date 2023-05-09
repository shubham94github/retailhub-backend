module.exports = app => {
    const startup = require("../controllers/startup.controller.js");
    var router = require("express").Router();
// NEW  
router.get("/new_startup",startup.new_startup);
//randomly selected
router.get("/top_rated",startup.randomly);

//recommended_top_6
router.get("/recommended_top_6",startup.recommended_top_6);

//particular sector / country
router.get("/particular_sector_country",startup.particular_sector_country);

//recommended_top_20
router.get("/recommended_top_20",startup.recommended_top_20);
//update_recommended_top_6
router.put("/update/recommended_top_6/:id",startup.update_recommended_top_6);
//recommended_top_20
router.put("/update/recommended_top_20/:id",startup.update_recommended_top_20);
// find One a new startup table
router.get("/:id",startup.findOne);

//Startup block
router.post("/status/block",startup.block);
//Startup unblock
router.post("/status/unblock",startup.unblock);
//startup tag
router.get("/tags/:id",startup.findTag);

router.get("/startup_similar/:id",startup.startup_similar);

    app.use("/api/startup", router);
  };