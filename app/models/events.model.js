module.exports = (sequelize, Sequelize) => {
    const events = sequelize.define("events", {
        title: {
        type: Sequelize.STRING
      },
      desc: {
        type: Sequelize.STRING
      },
      imgur: {
        type: Sequelize.STRING
      },
      articleurl: {
        type: Sequelize.STRING
      }
     });
  
    return events
  };