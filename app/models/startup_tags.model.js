module.exports = (sequelize, Sequelize) => {
  const startup_tags = sequelize.define('startup_tags',
    {
      startup_id: {
        type: Sequelize.BIGINT
      },
      tags_id: {
        type: Sequelize.BIGINT
      },
    },
    {
      timestamps: false
    }
  )

  return startup_tags
}
