module.exports = (sequelize, Sequelize) => {
    const startup_similar_to_cache = sequelize.define("startup_similar_to_cache", {
      
        similar_startup_id: {
        type: Sequelize.BIGINT
      },
      startup_id: {
        type: Sequelize.BIGINT
      },
        weight :{
            type:Sequelize.BIGINT
        }
    },{
        timestamps: false,
        tableName:"startup_similar_to_cache"
      });
  
    return startup_similar_to_cache;
  };
  