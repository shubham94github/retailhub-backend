'use strict'
const db = require('../app/models')
const Tags = db.tags
const StartupTags = db.startup_tags
const ArticlesTags = db.article_tag
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { startups } = require('../app/models')

/**
 * @description In This file we have to create only user related logic function
*/

exports.getTags = getTags
exports.createTags = createTags
exports.getTag = getTag
exports.updateTags = updateTags
exports.destroyTag = destroyTag

/**
 * @param {*} tag
 * @returns Create tag detail in sql database
 */
async function getTags() {
  return Tags.findAll({ order: [['id', 'DESC']], include: [{ model: startups, as: 'startups', attributes: ['id', 'brand_name'] }] })
}

/**
 * @param {*} tag
 * @returns Create tag detail in sql database
 */
async function createTags(tag) {
  return Tags.create(tag)
}

/**
 * @param {*} tag
 * @returns Create tag detail in sql database
 */
async function getTag(tagId) {
  return Tags.findOne({ where: { id: tagId } })
}

/**
 * @param {*} tag
 * @returns Create tag detail in sql database
 */
async function updateTags(payload) {
  return Tags.findOne({ where: { id: payload.id } })
}

/**
 * @param {*} tag
 * @returns Create tag detail in sql database
 */
async function destroyTag(tagId) {
  await StartupTags.destroy({ where: { tags_id: tagId } });
  await ArticlesTags.destroy({ where: { tag_id: tagId } });
  return Tags.destroy({ where: { id: tagId } })
  // return Tags.beforeDestroy(async tag => {
  //   await StartupTags.destroy({ where: { id : tag.id } })
  // })
}
