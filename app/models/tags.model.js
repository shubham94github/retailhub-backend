module.exports = (sequelize, Sequelize) => {
  const tags = sequelize.define("tags", {

    name: {
      type: Sequelize.STRING
    },
    name_lower_case: {
      type: Sequelize.STRING
    },
  }, {
    timestamps: false
  });

  return tags;
};
