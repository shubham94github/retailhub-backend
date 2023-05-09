module.exports = app => {
  const missions = require("../controllers/missions.controller.js");
  const { body, validationResult } = require('express-validator');
  var router = require("express").Router();

  // Create a new missions table
  router.post("/",body('title').notEmpty().exists().withMessage('please enter title or is unique'),
  body('description').notEmpty().withMessage('please enter description'),
  body('timeline').notEmpty().withMessage('please enter timeline'),
  body('budget').notEmpty().isNumeric().withMessage('please enter budget'),
  body('locations').notEmpty().withMessage('please enter locations'),
  body('startup').notEmpty().withMessage('please enter startup'),
   missions.create);

  // Retrieve all missions
  router.get("/allmission/:id?", missions.findAll);

  // // Retrieve all published missions
  // router.get("/published", missions.findAllPublished);

  // Retrieve a single missions with id
   router.get("/:id", missions.findOne);

  // Update a missions with id
  router.put("/:id",body('title').notEmpty().exists().withMessage('please enter title or is unique'),
  body('description').notEmpty().withMessage('please enter description'),
  body('timeline').notEmpty().withMessage('please enter timeline'),
  body('budget').notEmpty().isNumeric().withMessage('please enter budget'),
  body('locations').notEmpty().withMessage('please enter locations'),
  body('startup').notEmpty().withMessage('please enter startup'), missions.update);

  // Delete a missions with id
  router.delete("/:id", missions.delete);

  // Delete all missions
  router.delete("/", missions.deleteAll);

  router.put("/status/:id",missions.updateStatus)

  router.put("/assignto/:id",missions.assignto)
  router.post("/email/send",missions.mission_mail)
  // router.get("/user/:id",missions.get_user);
// My Missions
  router.get("/user-missions/:id", missions.myMission);
//update misions result
router.put("/result/:id",missions.updateResult);
//mission get of particular user by user_id
router.get("/user/:id",missions.findMissionByUser);
//filter missions by title,description and bode
router.post("/filter",missions.filter_mission);
  app.use("/api/missions", router);
};
