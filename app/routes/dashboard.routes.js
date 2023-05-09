module.exports = app => {
    const dashboard = require("../controllers/dashboard.controller.js");
   
    var router = require("express").Router();
  
    router.get("/:id?", dashboard.dashboardCount);
    
    // router.get("/", dashboard.dashboardCount);

    router.get("/timeline", dashboard.timeline);
  
    app.use("/api/dashboard", router);
  };
  