module.exports = (sequelize, Sequelize) => {
  const startup_categories = sequelize.define('startup_categories', {
    startup_id: {
      type: Sequelize.BIGINT
    },
    category_id: {
      type: Sequelize.BIGINT
    }
  },
  {
    timestamps: true,
    tableName: 'startup_categories'
  })

  return startup_categories
}
