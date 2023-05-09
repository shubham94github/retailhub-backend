const { startups,countries,startup_similar_to_cache,file_entities, video, articles, startup_tags, tags, sequelize} = require("../models");
const db = require("../models");
const Users = db.user;
const Startups = db.startups;
const Countrie = db.countries;
const Op = db.Sequelize.Op;
const { where, and } = require("sequelize");
const myArray = new Array();
exports.all=(req,res)=> {
    const browseType =req.body.browseType;
    if(req.body.businessModel!=null){
    const businessModelold =req.body.businessModel.map(function(x){ return x.replaceAll(' ', '_'); });
    myArray['businessModel'] =businessModelold.map(function(x){ return x.toUpperCase(); });
    }
// res.send(businessModelold);
if(req.body.companyStatus!=null){
     myArray['companyStatus'] =req.body.companyStatus.map(function(x){ return x.toUpperCase(); });
}
    // const companyType =req.body.companyType;
    if(req.body.companyType!=null){
      const companyTypeold =req.body.companyType.map(function(x){ return x.replaceAll(' ', '_'); });
      myArray['companyType'] =companyTypeold.map(function(x){ return x.toUpperCase(); });
      }
      // res.send(myArray['companyType'])
    const countryIds =req.body.countryIds;
    const startupFound =req.body.startupFound;
    if(startupFound!=null){
      const startDate=startupFound.fromDate;
      const endDate=startupFound.toDate;
    }
    
    //  res.send(startupFound.fromDate);
    const founded =req.body.founded;
    const isAvailableToChat =req.body.isAvailableToChat;
    const keyWord =req.body.keyWord;
    const narrowCategories =req.body.narrowCategories;
    const numberOfClients =req.body.numberOfClients;
    const page =req.body.page;
    const pageSize =req.body.pageSize;
    const presenceInCountriesIds =req.body.presenceInCountriesIds;
    const sort =req.body.sort;
    const sortDirection =req.body.sortDirection;
    const tags =req.body.tags;
    const targetMarket =req.body.targetMarket;
    // targetMarket
     
    if(req.body.targetMarket!=null){
      const targetMarketold =req.body.targetMarket.map(function(x){ return x.replaceAll(' ', '_'); });
      myArray['targetMarket'] =targetMarketold.map(function(x){ return x.toUpperCase(); });
      }
    //
    // sequelize.query("select u.id from startups u join startup_target_market t on t.startup_id = u.id join target_market_entity g on g.id = t.target_market_id where g.title in ('ASIA', 'NORTH_AMERICA') group by g.title ,u.id;").then(data => {
    //   res.send(data[0]);
    //   // myArray['targetMarket_sid']=data;
    // });
    const totalFundingAmount =req.body.totalFundingAmount;
    // res.send(companyStatus);
    // businessModel
    // myArray['data']=null;
    if(myArray['businessModel']!=null){
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
  // {
  //   model:articles,
  //   as :'startup_articles'
  // },
  ],
  where:{[Op.or] : [
    {"$startups.brand_name$" : {[Op.like] : `%${browseType}%`}},
    { "$startups.company_description$" : {[Op.like] : `%${browseType}%`}}
    // {"$startup_articles.isdeleted$" : false}
  ],
  [Op.and]:[{"$startups.business_model$" :{[Op.any] : myArray['businessModel']}}]
}})

.then(data => {
  myArray['data']=data;
      // if(data[0]==null){
      //   res.json({success: true,
      //     message: "Startups not found....",
      //     items: data})
      // }else{
      //   res.json({success: true,
      //     message: "Startups find successfully",
      //     items: data})
      // }
      
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Startups with id=" + 1
      });
    });
    }
    // companyStatus 
     else if (myArray['companyStatus']!=null) {
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
  // {
  //   model:articles,
  //   as :'startup_articles'
  // },
  ],
  where:{[Op.or] : [
    {"$startups.brand_name$" : {[Op.like] : `%${browseType}%`}},
    { "$startups.company_description$" : {[Op.like] : `%${browseType}%`}}
    // {"$startup_articles.isdeleted$" : false}
  ],
  [Op.and]:[{"$startups.company_status$" :{[Op.any] : myArray['companyStatus']}}]
}})

.then(data => {
  myArray['data']=data;
      // if(data[0]==null){
      //   res.json({success: true,
      //     message: "Startups not found....",
      //     items: data})
      // }else{
      //   res.json({success: true,
      //     message: "Startups find successfully",
      //     items: data})
      // }
      
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Startups with id=" + 1
      });
    });
    } 
    // companyType
    else if (myArray['companyType']!=null){
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
  // {
  //   model:articles,
  //   as :'startup_articles'
  // },
  ],
  where:{[Op.or] : [
    {"$startups.brand_name$" : {[Op.like] : `%${browseType}%`}},
    { "$startups.company_description$" : {[Op.like] : `%${browseType}%`}}
    // {"$startup_articles.isdeleted$" : false}
  ],
  [Op.and]:[{"$startups.company_type$" :{[Op.any] : myArray['companyType']}}]
}})

.then(data => {
  myArray['data']=data;
      // if(data[0]==null){
      //   res.json({success: true,
      //     message: "Startups not found....",
      //     items: data})
      // }else{
      //   res.json({success: true,
      //     message: "Startups find successfully",
      //     items: data})
      // }
      
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Startups with id=" + 1
      });
    });

    }
    // countryIds
    else if (countryIds!=null){
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
  // {
  //   model:articles,
  //   as :'startup_articles'
  // },
  ],
  where:{[Op.or] : [
    {"$startups.brand_name$" : {[Op.like] : `%${browseType}%`}},
    { "$startups.company_description$" : {[Op.like] : `%${browseType}%`}}
    // {"$startup_articles.isdeleted$" : false}
  ],
  [Op.and]:[{"$startups.hq_country_id$" :{[Op.any] : countryIds}}]
}})

.then(data => {
  myArray['data']=data;
    
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Startups with id=" + 1
      });
    });

    }    
    //  "startupFound":{
    //  "fromDate":"2021-07-07",
    //  "toDate":"2021-08-07"
    // },
    else if (startupFound!=null){
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
  // {
  //   model:articles,
  //   as :'startup_articles'
  // },
  ],
  where:{[Op.or] : [
    {"$startups.brand_name$" : {[Op.like] : `%${browseType}%`}},
    {"$startups.company_description$" : {[Op.like] : `%${browseType}%`}}
    // {"$startup_articles.isdeleted$" : false}
  ],
  [Op.and]:[{"$startups.created_at$" :{[Op.between] : [startDate, endDate]}}]
}})

.then(data => {
  myArray['data']=data;
    
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Startups with id=" + 1
      });
    });

    } 
    // targetMarket
    else if (myArray['targetMarket']!=null){
      // sequelize.query("select u.id from startups u join startup_target_market t on t.startup_id = u.id join target_market_entity g on g.id = t.target_market_id where g.title in ('ASIA', 'NORTH_AMERICA') group by g.title ,u.id;").then(data => {
      //   res.send(data);
      //   // myArray['targetMarket_sid']=data;
      // });

    }
    else {
     
    }
    res.json({success: true,
          message: "Startups find successfully",
          items: myArray['data']})
    // if(companyType!=null){
    //   res.send('hello');
    // }
    // if(countryIds!=null){
    //   res.send('hello');
    // }
    // if(filterClientName!=null){
    //   res.send('hello');
    // }
    // if(founded!=null){
    //   res.send('hello');
    // }
    // if(isAvailableToChat!=null){
    //   res.send('hello');
    // }
    // if(keyWord!=null){
    //   res.send('hello');
    // }
    // if(narrowCategories!=null){
    //   res.send('hello');
    // }
    // if(numberOfClients!=null){
    //   res.send('hello');
    // }
    // if(page!=null){
    //   res.send('hello');
    // }
    // if(pageSize!=null){
    //   res.send('hello');
    // }
    // if(presenceInCountriesIds!=null){
    //   res.send('hello');
    // }
    // if(sort!=null){
    //   res.send('hello');
    // }
    // if(sortDirection!=null){
    //   res.send('hello');
    // }
    // if(tags!=null){
    //   res.send('hello');
    // }
    // if(targetMarket!=null){
    //   res.send('hello');
    // }
    // if(totalFundingAmount!=null){
    //   res.send('hello');
    // }

    //test
//     Startups.findAll({
//       include: [{
//       model: Countrie,
//       as : 'country'
//   },{
//     model: file_entities,
//     as : 'logo'
// },{
//   model: file_entities,
//   as : 'logo_120'
// },{
//   model: file_entities,
//   as : 'logo_30'
// },
// {
//   model: file_entities,
//   as : 'logo_60'
// },{
//   model: video,
//   as : 'startup_interview_video'
// },
// {
//   model: video,
//   as : 'startup_marketing_video'
// },
// // {
// //   model:articles,
// //   as :'startup_articles'
// // },
// ],
// where:{[Op.or] : [
//   {"$startups.brand_name$" : {[Op.like] : `%${browseType}%`}},
//   { "$startups.company_description$" : {[Op.like] : `%${browseType}%`}}
//   // {"$startup_articles.isdeleted$" : false}
// ],
// [Op.and]:[{"$startups.business_model$" :{[Op.any] : businessModel}}]
// }})

// .then(data => {
//     if(data[0]==null){
//       res.json({success: true,
//         message: "Startups not found....",
//         items: data})
//     }else{
//       res.json({success: true,
//         message: "Startups find successfully",
//         items: data})
//     }
    
//   })
//   .catch(err => {
//     res.status(500).send({
//       message: "Error retrieving Startups with id=" + 1
//     });
//   });

    };

    // Startups.findAll({ where:{[Op.or] :
    //   [{"$startups.brand_name$" : {[Op.like] : `%${browseType}%`}},{ "$startups.company_description$" : {[Op.like] : `%${browseType}%`}},{"$startups.business_model$" : {[Op.in] : businessModel}}],
    // }}).then(data => {
    //     res.status(200).send({
    //       success : true,
    //       message:"Article find with tag name :",
    //       data:data
    //     });
    //   })
    //   .catch(err => {
    //     res.status(500).send({
    //       message:
    //         err.message || "Some error occurred while retrieving Articles by tagname."
    //     });
    //   });
    //  }
  