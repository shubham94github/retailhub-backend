const { events} = require("../models");
const db = require("../models");
const Events = db.events
const { QueryTypes } = require('sequelize');
const Op = db.Sequelize.Op;

//create events

exports.createEvent = (req,res)=>{
    const imgur=req.file.path.slice(25);
    const events = {
        title:req.body.title,
        desc:req.body.desc,
        imgur:req.file.path,
        articleurl:req.body.articleurl
      };
      // Save Events in the database
      Events.create(events).then(events=>res.json(events))
};

//updtae events
exports.updateEvent = (req, res) => {
    const id = req.params.id;
    req.body.imgur=req.file.path;
    Events.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            success:true,
            message: "Events was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Events with id=${id}. Maybe Events was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Events with id=" + id
        });
      });
  };

  // Delete a  with the specified id in the request
exports.deleteEvent = (req, res) => {
    const id = req.params.id;
  
    Events.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Events was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Events with id=${id}. Maybe Events was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Events with id=" + id
        });
      });
  };

  //get all events
  exports.findAll = (req, res) => {
   
    Events.findAll({ })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Events."
        });
      });
  };