const { training} = require("../models");
const db = require("../models");
const Training = db.training
const { QueryTypes } = require('sequelize');
const Op = db.Sequelize.Op;

//create training

exports.createTraining = (req,res)=>{
    const imgur=req.file.path.slice(25);
    const training = {
        title:req.body.title,
        desc:req.body.desc,
        imgur:req.file.path,
        articleurl:req.body.articleurl
      };
      // Save Training in the database
      Training.create(training).then(training=>res.json(training))
};

//updtae events
exports.updateTraining = (req, res) => {
    const id = req.params.id;
    req.body.imgur=req.file.path;
    Training.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            success:true,
            message: "Training was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Training with id=${id}. Maybe Training was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Training with id=" + id
        });
      });
  };

  // Delete a  with the specified id in the request
exports.deleteTraining = (req, res) => {
    const id = req.params.id;
  
    Training.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Training was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Training with id=${id}. Maybe Training was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Training with id=" + id
        });
      });
  };

  //get all Training records
  exports.findAll = (req, res) => {
   
    Training.findAll({ })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Training."
        });
      });
  };