module.exports = (sequelize, Sequelize) => {
    const Article_file = sequelize.define("r_articles_file_entities", {
        extension: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      },
      filename_on_disk: {
        type: Sequelize.STRING
      },
      pdf_id: {
        type: Sequelize.BIGINT
      },
      preview_id:{
        type:Sequelize.BIGINT
      },
      size: {
        type: Sequelize.BIGINT
      },
      thumbnail_id: {
        type: Sequelize.BIGINT
      },
    },{
      timestamps:false,
      tableName:"r_articles_file_entities"
    });
    return Article_file;
  };