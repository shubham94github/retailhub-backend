module.exports = (sequelize, Sequelize) => {
    const startupsCountries = sequelize.define("startup_presence_in_countries", {
      startup_id: {
        type: Sequelize.BIGINT
      },
      // country_id: {
      //   type: Sequelize.BIGINT
        
      // },
      country_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "db.countries",
          key: "id"
        },
        onDelete: "CASCADE"
      },
        
    });
    
    return startupsCountries;
  };