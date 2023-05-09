module.exports = (sequelize, Sequelize) => {
    const startup_areas_of_interest = sequelize.define("startup_areas_of_interest", {
        startup_id: {
        type: Sequelize.BIGINT
      },
      category_id: {
        type: Sequelize.BIGINT
      }
    },{
      timestamps:false,
      tableName:"startup_areas_of_interest"
    });
  
    return startup_areas_of_interest;
  };
  