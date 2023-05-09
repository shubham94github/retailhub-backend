module.exports = (sequelize, Sequelize) => {
    const file_entities = sequelize.define("file_entities", {
        extension: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      },
      filename_on_disk: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.BIGINT
      },
      user_id:{
        type:Sequelize.BIGINT
      },
      thumbnail_id: {
        type: Sequelize.BIGINT
      },
      pdf_id: {
        type: Sequelize.BIGINT
      },
      preview_id: {
        type: Sequelize.BIGINT
      },
    },{
      timestamps: false
    });
    
    return file_entities;
  };