const { retailers, sequelize } = require("../models");
const db = require("../models");
const retailer = db.retailers;
const Op = db.Sequelize.Op;
const { where, and } = require("sequelize");
const myArray = new Array();
//get all users

exports.retailerblock = (req,res)=>{
    const sid = req.params.id;
    // Startups.update({recommended_top_20 : true},{ where : {id:sid}}).then(data => {
      sequelize.query("UPDATE retailers SET is_verified = 'false' WHERE id = "+sid+" RETURNING *").then(data => {
        // myArray['startups']=data[0];
        res.send({
          success:true,
          message:"successfully update retailer",
          data:data[0]
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retailers."
        });
      });
}

exports.retailerunblock = (req,res)=>{
    const sid = req.params.id;
    // Startups.update({recommended_top_20 : true},{ where : {id:sid}}).then(data => {
      sequelize.query("UPDATE retailers SET is_verified = 'true' WHERE id = "+sid+" RETURNING *").then(data => {
        // myArray['startups']=data[0];
        res.send({
          success:true,
          message:"successfully update retailer unblock",
          data:data[0]
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retailers."
        });
      });
     }
      // Get retailer
      exports.getall = (req, res) => {
        retailer.findAll({ })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving retailer."
            });
          });
      };

    // getCountOfRetailer
    exports.getCountOfRetailer = (req, res) => {
        // res.send('data');
        sequelize.query("select count(*) from retailers").then(data => {
            res.send({
                success:true,
                message:"successfully get Count Of Retailer",
                data:data[0]
              });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving retailer."
            });
          });
      };
       // Get findOne
       exports.findOne = (req, res) => {
        const id =req.params.id;
        retailer.findAll({ where:{id:id} })
          .then(data => {
            res.send({
                success:true,
                message:"successfully get one retailer",
                data:data
              });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving retailer."
            });
          });
      };
      
