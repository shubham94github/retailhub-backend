module.exports = (sequelize, Sequelize) => {
    const countries = sequelize.define("countries", {
        name: {
        type: Sequelize.STRING
      },
      iso: {
        type: Sequelize.STRING
      },
      iso3: {
        type: Sequelize.STRING
      },
      nicename: {
        type: Sequelize.STRING
      },
      numcode: {
        type: Sequelize.BIGINT
      },
      phonecode: {
        type: Sequelize.BIGINT
      }
    },{
        timestamps: false
      });
  
    return countries;
  };
  