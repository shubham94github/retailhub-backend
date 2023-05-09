module.exports = (sequelize, Sequelize) => {
    const articles_tags = sequelize.define("articles_tags", {
      
        articles_id: {
        type: Sequelize.BIGINT
      },
      tags_id: {
        type: Sequelize.BIGINT
      },
    },{
        timestamps: false,
        tableName:'articles_tags'
      });
  
    return articles_tags;

    }