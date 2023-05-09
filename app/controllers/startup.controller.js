const { startups,countries,startup_similar_to_cache,file_entities, video, articles, startup_tags, tags, sequelize} = require("../models");
const db = require("../models");
const Startups = db.startups;
const Op = db.Sequelize.Op;
const Countrie = db.countries;
const Startup_similar_to = db.startup_similar_to_cache;
const { where, and } = require("sequelize");
const { body , validationResult } = require("express-validator");
const { json } = require("body-parser");
const tagsModel = require("../models/tags.model");
const myArray = new Array();
//get all 
exports.findOne =  (req, res) => {
    const brand_name = req.params.id;
    const b_name = brand_name.replace(/[^a-zA-Z0-9]/g, "")
 
    Startups.findAll({
      include: [{
      model: Countrie,
      as : 'country'
  },{
    model: file_entities,
    as : 'logo'
},{
  model: file_entities,
  as : 'logo_120'
},{
  model: file_entities,
  as : 'logo_30'
},
{
  model: file_entities,
  as : 'logo_60'
},{
  model: video,
  as : 'startup_interview_video'
},
{
  model: video,
  as : 'startup_marketing_video'
},
{
  model:articles,
  as :'startup_articles'
},
],where:{[Op.and] : [
  {"$startups.brand_name$" : {[Op.like] : `%${b_name}%`}},
  {"$startup_articles.isdeleted$" : false}
]}}).then(data => {
    if(data[0]==null){
      res.json({success: true,
        message: "Startups not found....",
        data: data[0]})
    }else{
      res.json({success: true,
        message: "Startups find successfully",
        data: data[0]})
    }
    
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Startups with id=" + 1
    });
  });
  };
     //block startup
     exports.block = (req,res)=>{
      const sid = req.body.id;
      Startups.update({is_blocked : true},{ where : {id:sid}}).then(data => {
    res.send({
      success:true,
      message: "successfully block startup",
    });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving startup."
    });
  });
    };
    //unblock startup
    exports.unblock = (req,res)=>{
      const sid = req.body.id;
      Startups.update({is_blocked : false},{ where : {id:sid}}).then(data => {
    res.send({
      success:true,
      message: "successfully unblock startup",
    });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving startup."
    });
  });
    };
//find tag 
    exports.findTag =  (req, res) => {
      const id = req.params.id;
      sequelize.query("SELECT * FROM public.startup_tags as stg, tags as tg where stg.startup_id = "+id+" AND tg.id=stg.tags_id").then(data => {
        res.send(data[0]);
      })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Startups tags with id=" + id
      });
    });
    };
//get simlar startup
    exports.startup_similar = (req,res)=>{
      const id = req.params.id;
      sequelize.query("SELECT stm.similar_startup_id,stm.startup_id,st.*,stm.id as sid FROM public.startup_similar_to_cache as stm, startups as st where stm.startup_id = "+id+" AND st.id=stm.similar_startup_id").then(data => {
        res.send(data[0]);
      })
      // Startup_similar_to.findAll({where:{startup_id:5724}}).then(data => {
      //   res.send(data);
      // })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      });
    }
    //NEW 
    exports.new_startup = (req,res)=>{
      Startups.findAll({
        limit: 6,
        where: {is_approved_by_admin:true
        },
        order: [ [ 'created_at', 'DESC' ]]
      }).then(data => {
        res.send({
          success:true,
          message: "successfully block startup",
          items:data
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      });
    }
    //recommended_top_6
    exports.recommended_top_6 = (req,res)=>{
      Startups.findAll({
        limit: 6,
        where: {recommended_top_6:true
        },
        order: [ [ 'id', 'ASC' ]]
      }).then(data => {
        res.send({
          success:true,
          message: "successfully recommended top 6 startups",
          items:data
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      });
    }
   //recommended_top_20
   exports.recommended_top_20 = (req,res)=>{
    Startups.findAll({
      limit: 20,
      where: {recommended_top_20:true
      },
      order: [ [ 'id', 'ASC' ]]
    }).then(data => {
      res.send({
        success:true,
        message: "successfully recommended top 20 startups",
        items:data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving recommended top 20."
      });
    });
  }
    //update_recommended_to_6 
    
    exports.update_recommended_top_6 = (req,res)=>{
      const sid = req.params.id;
      //
      
   //
    sequelize.query("UPDATE startups SET recommended_top_6 = '"+req.body.recommended_to_6+"' WHERE id = "+sid+" RETURNING *").then(data => {
        // myArray['startups']=data[0];
        res.send({
          success:true,
          message:"successfully update recommended_top_6 startup",
          data:data[0]
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Events."
        });
      });
     
    };
// update_recommended_top_20
    exports.update_recommended_top_20 = (req,res)=>{
      const sid = req.params.id;
      // Startups.update({recommended_top_20 : true},{ where : {id:sid}}).then(data => {
        sequelize.query("UPDATE startups SET recommended_top_20 = '"+req.body.recommended_top_20+"' WHERE id = "+sid+" RETURNING *").then(data => {
          // myArray['startups']=data[0];
          res.send({
            success:true,
            message:"successfully update recommended_top_20 startup",
            data:data[0]
          });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Events."
          });
        });
    };
// randomly
    exports.randomly = (req,res)=>{
      Startups.findAll({
        limit: 6,
        where: {is_approved_by_admin:true
        },
        order:sequelize.random(),
      }).then(data => {
        res.send({
          success:true,
          message: "successfully randomly startups",
          items:data
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving randomly startups."
        });
      });
    }
    //particular_sector_country
    exports.particular_sector_country = (req,res)=>{
      sequelize.query("SELECT a.hq_country_id, COUNT(a.*) as numberofStartup, b.name as countryname FROM startups as a, countries b where a.hq_country_id = b.id group by a.hq_country_id, b.id ORDER BY a.hq_country_id").then(data => {
        // myArray['startups']=data[0];
        res.send({
          success:true,
          message:"successfully update recommended_top_20 startup",
          data:data[0]
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Events."
        });
      });
    }