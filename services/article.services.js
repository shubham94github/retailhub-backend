'use strict'
let config = require('../configuration/config')
const db = require('../app/models')
const Articles = db.articles
const Tags = db.tags;
const FileEntitie = db.file_entities
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { startups, tags } = require("../app/models");
const responseHelper = require('../helpers/responseHelper.js');
const { articleMessages } = require('../helpers/message');
/**
 * @description In This file we have to create only user related logic function
 */

exports.createArticleService = createArticleService;
exports.createFileService = createFileService;
exports.getArticlesService = getArticlesService;
exports.getUpdateArticleObject = getUpdateArticleObject;
exports.getArticlesByStartupService = getArticlesByStartupService;
exports.editArticleService = editArticleService;
exports.getArticlebyTagName = getArticlebyTagName;
exports.getArticleById = getArticleById;
exports.addArticleTag = addArticleTag;
exports.removeArticleTag = removeArticleTag;
exports.destroy = destroy;

/**
 * @param {*} article
 * @returns Create article detail in sql database
 */
async function getArticlesService (request) {
  let [search, pageNum] = getPaginationKeys(request);
  return Articles.findAll({
    where: getSearchFilter(search),
    include: [{ model: startups, as: 'startup', attributes: ["id", "brand_name", "company_legal_name"] }, { model: tags, as: 'tags',  attributes: ["id", "name"]}],
    // include: [{
    //   model: startups,
    //   as: 'startup'
    // }],
    order: [ ['id', 'DESC']],
  })
}
/**
 * @description This method get Pagination Keys
 * @method getPaginationKeys
 * 
 */
function getPaginationKeys(request) {
  let search = request.query?.search ? request.query?.search?.trim() : '';
  let pageNum = request.query.pageNum ? +request.query.pageNum : 0;
  return [search, pageNum];
}
/**
* @description This method get filter
* @method getSearchFilter
* 
*/
function getSearchFilter(search) {
  if (!search) return { isdeleted: false }
  return {
      [Op.or]: [{ title: { [Op.like]: '%' + search + '%' } },
      { description: { [Op.like]: '%' + search + '%' } }
    ],
    isdeleted: false
  }
}
/**
 * @param {*} getArticlesByStartup
 * @returns getArticlesByStartup article detail in sql database
 */
async function getArticlesByStartupService (startupId) {
  return Articles.findAll({ where: { isdeleted: false, start_up_id: startupId },  include: [{ model: tags, as: 'tags', attributes: ["id", "name"]}] })
}

/**
 * @param {*} article
 * @returns Create article detail in sql database
 */
async function createArticleService (article) {
  return Articles.create(article)
}

/**
 * @param {*} article
 * @returns Create article detail in sql database
*/ 
async function editArticleService (updatedArticle) {
  return Articles.findOne({ where: { id: updatedArticle.id, isdeleted: false} })
}

/**
 * @param {*} getArticlebyTagName
 * @returns get article by tag name detail in sql database
 */
 
async function getArticlebyTagName (ids) {
  const getIds = ids?.split(',').map((item) => item)
  return Articles.findAll({ order: [['id', 'DESC']], isdeleted: false , include: [{ model: tags, as: "tags", where: {name: getIds} }] })
}

/**
 * @param {*} getArticlebyTagName
 * @returns get article by tag name detail in sql database
 */
 
 async function getArticleById(articleId) {
  return Articles.findOne({ where: { id: articleId, isdeleted: false}, include: [{ model: tags, as: "tags", attributes: ["id", "name"] }] })
}

/**
 * @param {*} destroy
 * @returns delete article by id in sql database
 */
 
 async function destroy(articleId) {
  return Articles.findOne({ where: { id: articleId } })
  .then((article) => article && article.update({ isdeleted: true }))
}

/**
 * @param {*} Files
 * @returns Create Files detail in sql database
 */
async function createFileService (req) {
  const fileObj = {
    extension: req.extension,
    filename: req.filename,
    filename_on_disk: req.filename_on_disk,
    size: req.size,
    thumbnail_id: null,
    pdf_id: null,
    preview_id: null,
    user_id: parseInt(req.user_id)
  };
  return FileEntitie.create(fileObj)
}

/**
 * @param {*} getUpdateArticleObject
 * @returns update getUpdateArticleObject detail in sql database
 */
function getUpdateArticleObject(body) {
  return async function (createdArticle) {
    if (!createdArticle) throw { type: responseHelper.NOT_FOUND_ERROR_KEY, message: articleMessages.ARTICLE_NOT_FOUND }
    let updatedObject = {
      title: body?.title ? body.title : createdArticle.title,
      description: body?.description ? body.description : createdArticle.description,
      body: body?.body ? body.body : createdArticle.body,
      date: body?.date ? body.date : createdArticle.date,
      area_interest: body?.area_interest ? body?.area_interest : createdArticle.area_interest,
      articles_link: body?.articles_link ? body?.articles_link : createdArticle.articles_link,
      image_name: body?.image_name ? body?.image_name : createdArticle.image_name
    }
    return [updatedObject, createdArticle]
  }
}


/**
 * @description This function use to get articles and subadmin list by admin
 * @method addArticleTag
 */
 async function addArticleTag(tagIds, articleId) {
  await Promise.all(JSON.parse(tagIds).map(async ({id}) => {
      return Tags.findByPk(id)
          .then((tag) => {
          if (!tag) return null;
          return Articles.findByPk(articleId).then((article) => {
              if (!article) return null;
              tag.addRh_articles(article);
              console.log(`>> added Article id=${article.id} to Tag id=${tag.id}`);
              return article;
          });
          })
          .catch((err) => console.log(">> Error while adding Article to Tag: ", err) );
  }))
  return getArticleById(articleId)
  
};

/**
 * @description This function use to get articles and subadmin list by admin
 * @method removeArticleTag
 */
 async function removeArticleTag(articleId) {
  let articleCurrentTags = await Articles.findOne({ where: { id: articleId, isdeleted: false}, include: [{ model: tags, as: 'tags' }] });
  if (articleCurrentTags.tags) {
    return Promise.all(articleCurrentTags.tags.map(async ({id}) => {
      return Tags.findByPk(id)
          .then((tag) => {
          if (!tag) return null;
          return Articles.findByPk(articleId).then((article) => {
              if (!article) return null;
              tag.removeRh_articles(article);
              console.log(`>> removed Article id=${article.id} to Tag id=${tag.id}`);
              return article;
          });
          })
          .catch((err) => console.log(">> Error while adding Article to Tag: ", err) );
    }))
  }
};