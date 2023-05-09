module.exports = (sequelize, Sequelize) => {
    const training = sequelize.define("training", {
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
  
   return training
  };