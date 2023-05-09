module.exports = (sequelize, Sequelize) => {
    const video = sequelize.define("video", {
      description: {
        type: Sequelize.TEXT
      },
      link: {
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.TEXT
      },
      video_source: {
        type: Sequelize.STRING
      },
      video_type: {
        type: Sequelize.STRING
      }
    },{
        timestamps: false,
        tableName:"video"
      });
  
    return video;
  };