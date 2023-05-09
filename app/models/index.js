const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const conf = require('../../configuration/config');
const env = conf.get('environment') || 'development';
const config = require(__dirname + '/../../config/config.json')[env];
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,

//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   }
// });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.missions = require("./missions.model.js")(sequelize, Sequelize);
db.user =require("./users.model.js")(sequelize,Sequelize);
db.mobileUsers =require("./mobile_users.model.js")(sequelize,Sequelize);
db.startups = require("./startups.model.js")(sequelize, Sequelize);
db.articles = require("./articles.model.js")(sequelize, Sequelize);
db.article_file = require("./articles_file_entities.model.js")(sequelize, Sequelize);
db.countries = require("./countries.model.js")(sequelize, Sequelize);
db.startup_categories = require("./startup_categories.model.js")(sequelize, Sequelize);
db.startup_areas_of_interest = require("./startup_areas_of_interest.model.js")(sequelize, Sequelize);
db.startupsCountries = require("./startups_countries.model.js")(sequelize, Sequelize);
db.category = require("./category.model.js")(sequelize,Sequelize);
db.file_entities = require("./file_entities.model.js")(sequelize,Sequelize);
db.startup_forms = require("./startup_forms.model.js")(sequelize,Sequelize);
db.video = require("./video.model.js")(sequelize,Sequelize);
db.events = require("./events.model.js")(sequelize,Sequelize);
db.training =  require("./training.model.js")(sequelize,Sequelize);
db.startup_similar_to_cache = require("./startup_similar_to_cache.model.js")(sequelize,Sequelize);
db.startup_tags = require("./startup_tags.model.js")(sequelize,Sequelize);
db.tags = require("./tags.model.js")(sequelize,Sequelize);
db.Verification = require("./verification.model.js")(sequelize,Sequelize);
db.retailers=require("./retailers.model.js")(sequelize,Sequelize);
db.startup_target_market=require("./startup_target_market.model")(sequelize,Sequelize);
db.target_market_entity=require("./target_market_entity.model")(sequelize,Sequelize);
db.article_tag = require("./article_tag.model.js")(sequelize, Sequelize);

//retionship
db.tags.belongsToMany(db.articles, {
  through: "article_tag",
  as: "rh_articles",
  foreignKey: "tag_id",
});
db.articles.belongsToMany(db.tags, {
  through: "article_tag",
  as: "tags",
  foreignKey: "article_id",
});
// startups relation tags
db.tags.belongsToMany(db.startups, {
  through: "startup_tags",
  as: "startups",
  foreignKey: "tags_id",
});
db.startups.belongsToMany(db.tags, {
  through: "startup_tags",
  as: "tags",
  foreignKey: "startup_id",
});
// startups relation category
db.category.belongsToMany(db.startups,{
  through: "startup_categories",
  as: "startups",
  foreignKey: "category_id",
});
db.startups.belongsToMany(db.category,{
  through: "startup_categories",
  as: "category",
  foreignKey: "startup_id",
})

db.missions.belongsTo(db.user,{
  foreignKey:'user_id',
  as:'user'
});
db.user.hasMany(db.missions,{
  foreignKey:'user_id',
  as:'missions'
})

// startup countries
db.startups.belongsTo(db.countries,{
  foreignKey:'hq_country_id',
  as:'country'
});

//startup logo id
db.startups.belongsTo(db.file_entities,{
  foreignKey:'logo_id',
  as:'logo'
});

//startup logo 20 id
db.startups.belongsTo(db.file_entities,{
  foreignKey:'logo_120_id',
  as:'logo_120'
});

//startup logo 30 id
db.startups.belongsTo(db.file_entities,{
  foreignKey:'logo_30_id',
  as:'logo_30'
});
//startup logo 60 id
db.startups.belongsTo(db.file_entities,{
  foreignKey:'logo_60_id',
  as:'logo_60'
});

 //startup startup_interview_video_id
 db.startups.belongsTo(db.video,{
  foreignKey:'startup_marketing_video_id',
  as:'startup_marketing_video'
});

 //startup startup_marketing_video_id
 db.startups.belongsTo(db.video,{
  foreignKey:'startup_interview_video_id',
  as:'startup_interview_video'
});

//startup startup_marketing_video_id
db.articles.belongsTo(db.startups,{
  foreignKey:'start_up_id',
  as:'startup'
});
//articles get with references file entities 
db.articles.belongsTo(db.file_entities,{
  foreignKey:'file_id',
  as:'image'
})
//articles get with references file entities 
db.articles.belongsTo(db.article_file,{
  foreignKey:'file_id',
  as:'article_image'
})
//get startup with it articles
db.startups.hasMany(db.articles,{
  foreignKey:'start_up_id',
  as:'startup_articles'
})
//get startup_similar_to_cache
db.startups.hasMany(db.startup_similar_to_cache,{
  foreignKey:'startup_id',
  as:'startup_similar_to_cache'
})
// get startup_similar_to_cache
db.startup_similar_to_cache.belongsTo(db.startups,{
  foreignKey :'similar_startup_id',
  as : 'startups',
})
 // 
 db.missions.belongsTo(db.user,{
  foreignKey:'assignto',
  as:'assign_user'
});

//category of logo 24
db.category.belongsTo(db.file_entities,{
  foreignKey:'logo24_id',
  as:'logo24'
});

//category of areas logo 24
db.category.belongsTo(db.file_entities,{
  foreignKey:'areas_logo24_id',
  as:'areas_logo24'
});
//artcles tags from tags table
db.startup_forms.belongsTo(db.countries,{
  foreignKey:'hq_country_id',
  as:'country'
});

// //
// db.startups.hasMany(db.articles,{
//   foreignKey:'start_up_id',
//   as:'startup_articles'
// })



module.exports = db;
