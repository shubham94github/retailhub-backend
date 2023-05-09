module.exports = (sequelize, Sequelize) => {
    const articles = sequelize.define("rh_articles", {
      body: {
        type: Sequelize.TEXT
      },
      date: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.TEXT
      },
      isdeleted: {
        type: Sequelize.BOOLEAN
      },
      articles_link:{
        type:Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      file_id: {
        type: Sequelize.BIGINT
      },
      start_up_id: {
        type: Sequelize.BIGINT
      },
      imagedata: {
        type: Sequelize.BLOB
      },
      image_name:{
        type: Sequelize.STRING
      },
      image_type:{
        type: Sequelize.STRING
      },
      area_interest: {
        type: Sequelize.JSON
      },
      restricted:{
        type:Sequelize.BIGINT
      }
    },{
      tableName : "rh_articles"
    });
    
    return articles;
  };
  