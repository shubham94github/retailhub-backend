'use strict';
const responseHelper = require('../helpers/responseHelper.js');
const { startupMessages } = require('../helpers/message');
const RetailerService = require('../services/retailer.services');

exports.createRetailer = createRetailer;




/**
 * @description This function use to create new client by admin and subadmin
 * @method createRetailer
 * @url api/create/article
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
function createRetailer(payload) {
    return createRetailerObject(payload)
        .then(RetailerService.store)
        .then((result) => result)
        .catch((err) => console.log(err))
}
/**
 * @param {*} retailer 
 * @returns Create retailer detail in sql database
 */
async function createRetailerObject(payload) {
    return {
        is_company: payload.isCompany,
        phone_number: payload.phoneNumber,
        email_domain: payload.emailDomain,
        // company_type: payload.businessType,
        company_short_name: payload.companyShortName,
        company_legal_name: payload.companyLegalName,
        is_deleted: false,
    }
}
/**
 * @param {*} createdStartupResponse 
 * @returns Create createdStartupResponse detail in sql database
 */
function createdStartupResponse(startup) {
    if (!startup) throw { type: responseHelper.REQUEST_NOT_COMPLETE, message: startupMessages.SOMETHING_WRONG }
    startup = {
        id: startup.id,
        is_company: startup.is_company,
        email_domain: startup.body,
        company_type: startup.date,
        company_short_name: startup.start_up_id,
        company_legal_name: startup.tags,
        is_deleted: false,
    }
    return {
        message: startupMessages.NEW_STARTUP_CREATED,
        data: startup
    }
}

