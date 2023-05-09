module.exports = (sequelize, Sequelize) => {
  const article_tag = sequelize.define('article_tag', {
      article_id: {
        type: Sequelize.BIGINT
      },
      tag_id: {
        type: Sequelize.BIGINT
      }
    },
    {
      timestamps: true,
      tableName: 'article_tag'
    }
  )

  return article_tag
}
