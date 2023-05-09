const { category, sequelize, file_entities } = require("../models");
const db = require("../models");
const Category = db.category;
const Op = db.Sequelize.Op;
const { where, and } = require("sequelize");
const { body , validationResult } = require("express-validator");
const myArray = new Array();
//get all users

   //search users by

   exports.create = (req, res) =>  {
    // res.send(req.files);
    Object.keys(req.files).forEach(function(k, v){
      
      if(k == 0){
        res.send(v);
      }
  });
   
    // const errors = validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    //   }
      // const category = {
      //   child_header: req.body.child_header,
      //   is_custom: req.body.is_custom,
      //   name:req.body.name,
      //   parent_id:req.body.parent_id,
      //   parent_names:req.body.parent_names,
      //   weight:req.body.weight,
      //   count_using_retailers:req.body.count_using_retailers,
      //   count_using_startup_in_areas_of_interest:req.body.count_using_startup_in_areas_of_interest,
      //   count_using_startup_in_categories:req.body.count_using_startup_in_categories,
      //   logo_url:req.body.logo_url,
      //   logo24_id:req.body.logo24_id,
      //   areas_logo_url:req.body.areas_logo_url,
      //   areas_logo24_id:req.body.areas_logo24_id,
      //   is_deleted:false,
      //     };
      //     // Save category in the database
      //     Category.create(category).then(category=>res.json(category))
        };

        //get all category 
        exports.findAll = async(req, res) => {
       
          Category.findAll({ include: [{
            model: file_entities,
            as : 'logo24'
        },{
          model: file_entities,
            as : 'areas_logo24'
        }],where:{is_deleted:false} }).then(data => {
            res.status(200).send({
              success : true,
              message:"category find successfully",
              data:data});
          })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving Category."
              });
            });
        };
//delete category by id 
exports.deleteCategory = (req, res) => {
  const id = req.params.id;

  Category.update({is_deleted:true},
    {where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Category was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Category with id=" + id
      });
    });
};        