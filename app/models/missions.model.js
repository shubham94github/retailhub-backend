module.exports = (sequelize, Sequelize) => {
  const missions = sequelize.define("missions", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    timeline: {
      type: Sequelize.STRING
    },
    budget: {
      type: Sequelize.STRING
    },
    user_id:{
      type:Sequelize.BIGINT,
    //   references: {
    //     model: './users.model.js', 
    //     key: 'user_id',
    //  }
    },
    locations: {
      type: Sequelize.JSON
    },
    startup: {
      type: Sequelize.JSON
    },
    interest: {
      type: Sequelize.JSON
    },
    assignto:{
      type:Sequelize.BIGINT
    },
    isdeleted: {
      type:Sequelize.BOOLEAN
    },
    status: {
      type:Sequelize.STRING
    },
    mission_result:{
      type:Sequelize.STRING
    }
    
  });

  return missions;
};
