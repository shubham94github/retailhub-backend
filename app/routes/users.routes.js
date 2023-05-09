const { sequelize } = require("../models/index.js");
const express = require('express');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = app => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();
//get all users
    router.get("/:id?", users.get_users);
  //search user by fullname
  router.get("/search/:id",users.search_user);

  router.post('/login',users.login);

    app.use("/api/users", router);
}