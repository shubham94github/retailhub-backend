'use strict';
const db = require('../app/models');
const Startups = db.startups;
const StartupForm = db.startup_forms;
const Countrie = db.countries;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { startups, file_entities, video, tags, articles, category, startup_similar_to_cache } = require('../app/models');

/**
 * @description In This file we have to create only user related logic function
 */
exports.getStartupsService = getStartupsService;
exports.getStartupByName = getStartupByName;
exports.getStartupById = getStartupById;
exports.store = store;
exports.destroy = destroy;
exports.getStartupsForm = getStartupsForm;
exports.storeForm = storeForm;

/**
 * @param {*} startup
 * @returns Create startup detail in sql database
 */
async function getStartupsService(request, response) {
	let [search, pageNum, listLimit, sortfield, sortOrder, tagIds, categoryId, countryId, companyType, companyStatus, businessModel, startedDate, endDate] = getPaginationKeys(request);

	return Startups.findAndCountAll({
		where: getSearchFilter(search, countryId, companyType, companyStatus, businessModel, startedDate, endDate),
		limit: listLimit,
		include: [
			{ model: tags, as: 'tags', where: getSearchFilterTag(tagIds), attributes: ['id', 'name'] },
			{ model: Countrie, as: 'country' },
			{ model: category, as: 'category', where: getSearchCategoryFilter(categoryId), attributes: ['id', 'name', 'parent_id', 'parent_names']},
			{ model: file_entities, as: 'logo' },
			{ model: file_entities, as: 'logo_120' },
			{ model: file_entities, as: 'logo_30' },
			{ model: file_entities, as: 'logo_60' },
			{ model: video, as: 'startup_interview_video' },
			{ model: video, as: 'startup_marketing_video' },
			{ model: articles, as: 'startup_articles' },
		],
		offset: pageNum,
		distinct: true,
		order: [[sortfield || 'id', sortOrder || 'DESC']], // sort at here
	});
}
/**
 * @description This method get Pagination Keys
 * @method getPaginationKeys
 *
 */
function getPaginationKeys(request) {
	const getIds = request.query?.tagIds?.split(',').map((item) => item);
	let search = request.query?.search ? request.query?.search : '';
	let pageNum = request.query?.pageNum ? +request.query?.pageNum : 0;
	let listLimit = request.query?.size ? +request.query?.size : 5;
	let sortfield = request.query?.sortfield ? request.query?.sortfield : 'id';
	let sortOrder = request.query?.sortOrder ? request.query?.sortOrder : 'DESC';
	let tagIds = request.query?.tagIds ? getIds : null;
	let categoryId = request.query?.categoryId ? request.query?.categoryId : null;
	let countryId = request.query?.countryId ? request.query?.countryId : null;
	let companyType = request.query?.companyType ? request.query?.companyType : null;
	let companyStatus = request.query?.companyStatus ? request.query?.companyStatus : null;
	let businessModel = request.query?.businessModel ? request.query?.businessModel : null;
	let startedDate = request.query?.startedDate ? request.query?.startedDate : null;
	let endDate = request.query?.endDate ? request.query?.endDate : null;
	return [search, pageNum, listLimit, sortfield, sortOrder, tagIds, categoryId, countryId, companyType, companyStatus, businessModel, startedDate, endDate];
}
/**
 * @description This method get Pagination Keys
 * @method getPaginationKeys
 *
 */
function getSearchFilter(search, countryId, companyType, companyStatus, businessModel, startedDate, endDate) {
	let filterObject = {is_deleted: false}
	if(search) filterObject = {[Op.or]: [{ company_legal_name: { [Op.iLike]: '%' + search + '%' } }, { brand_name: { [Op.iLike]: '%' + search + '%' } }, { company_short_name: { [Op.iLike]: '%' + search + '%' } }]};
	if(startedDate && endDate) filterObject.founded_at = {[Op.between] : [startedDate , endDate ]}
	if(countryId) filterObject.hq_country_id = countryId;
	if(companyType) filterObject.company_type = companyType;
	if(companyStatus) filterObject.company_status = companyStatus;
	if(businessModel) filterObject.business_model = businessModel;
	return filterObject;
}
/**
 * @description This method get Pagination Keys
 * @method getPaginationKeys
 *
 */
function getSearchCategoryFilter(category) {
	if (!category) return { is_deleted: false };
	return {
		[Op.or]: [
			// { id: { [Op.iLike]: '%' + category + '%' } },
			{ id: category },
			{ parent_id: category },
		],
		is_deleted: false,
	};
}

/**
 * @description This method get Pagination Keys
 * @method getPaginationKeys
 *
 */
function getSearchFilterTag(tagIds) {
	if (!tagIds) return {};
	return {
		id: tagIds,
	};
}
/**
 * @param {*} starturp
 * @returns Create starturp detail in sql database
 */
async function getStartupByName(name) {
	return Startups.findOne({
		where: Sequelize.where(
			Sequelize.fn('lower', Sequelize.col('company_short_name_lower_case')),
			Sequelize.fn('lower', name)
		),
		include: [
			{ model: tags, as: 'tags' },
			{
				model: startup_similar_to_cache,
				as: 'startup_similar_to_cache',
				include: [
					{
						model: startups,
						as: 'startups',
						attributes: ['id', 'brand_name', 'company_legal_name', 'company_description'],
					},
				],
			},
			{ model: Countrie, as: 'country' },
			{ model: file_entities, as: 'logo' },
			{ model: file_entities, as: 'logo_120' },
			{ model: file_entities, as: 'logo_30' },
			{ model: file_entities, as: 'logo_60' },
			{ model: video, as: 'startup_interview_video' },
			{ model: video, as: 'startup_marketing_video' },
			{ model: articles, as: 'startup_articles' },
		],
		is_deleted: false,
	});
}

/**
 * @param {*} Startups
 * @returns Create Startups detail in sql database
 */
async function store(payload) {
	return Startups.create(payload);
}

/**
 * @param {*} startup
 * @returns get startup detail in sql database
 */
async function getStartupById(startupId) {
	return Startups.findOne({
		where: { id: startupId },
		include: [{ model: tags, as: 'tags', attributes: ['id', 'name'] }],
	});
}

/**
 * @param {*} destroy
 * @returns delete Startups by id in sql database
 */

async function destroy(startupId) {
	return Startups.findOne({ where: { id: startupId } }).then(
		(startup) => startup && startup.update({ is_deleted: true })
	);
}

/**
 * @param {*} getStartupsForm
 * @returns get Startups detail in sql database
 */
async function getStartupsForm(request) {
	let [search, pageNum, listLimit] = getPaginationKeys(request);
	return StartupForm.findAndCountAll({
		where: getSearchFilterForm(search),
		limit: listLimit,
		include: [{ model: Countrie, as: 'country' }],
		offset: pageNum,
		order: [['id', 'DESC']], // sort at here
	});
}
/**
 * @description This method get Pagination Keys
 * @method getPaginationKeys
 *
 */
function getSearchFilterForm(search) {
	if (!search) return { is_deleted: false };
	return {
		[Op.or]: [
			{ name: { [Op.iLike]: '%' + search + '%' } },
			{ stage: { [Op.iLike]: '%' + search + '%' } },
			{ contact_name: { [Op.iLike]: '%' + search + '%' } },
		],
		is_deleted: false,
	};
}
/**
 * @param {*} StartupsForm
 * @returns Create Startups detail in sql database
 */
async function storeForm(payload) {
	return StartupForm.create(payload);
}
