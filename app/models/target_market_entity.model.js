module.exports = (sequelize, Sequelize) => {
    const target_market_entity = sequelize.define("target_market_entity", {
        title: {
        type: Sequelize.BIGINT
      },
    },{
        timestamps: false
      });
    return target_market_entity;
  };