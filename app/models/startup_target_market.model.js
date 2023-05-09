module.exports = (sequelize, Sequelize) => {
    const startup_target_market = sequelize.define("startup_target_market", {
        startup_id: {
        type: Sequelize.BIGINT
      },
      target_market_id: {
        type: Sequelize.BIGINT
      },
    },{
        timestamps: false
      });
    return startup_target_market;
  };
  