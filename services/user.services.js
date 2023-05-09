'use strict'
const db = require('../app/models')
const MobileUser = db.mobileUsers
const User = db.user
const Verification = db.Verification
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { ROLES } = require('../helpers/constants');
/**
 * @description In This file we have to create only user related logic function
 */

exports.findAllAdmin = findAllAdmin
exports.findAll = findAll
exports.store = store
exports.findOne = findOne
exports.findOneByEmail = findOneByEmail
exports.update = update
exports.destroy = destroy
exports.verificationCreate = verificationCreate
exports.updateForgetpasswordCode = updateForgetpasswordCode
exports.findOnebByCode = findOnebByCode
exports.findOneVerification = findOneVerification

/**
 * @param {*} User
 * @returns Create User detail in sql database
 */
async function findAllAdmin () {
  return User.findAll({where: {role: ROLES.SUPER_ADMIN}, attributes: ['id', 'email']})
}

/**
 * @param {*} User
 * @returns Create User detail in sql database
 */
async function findAll () {
  return MobileUser.findAll({order: [['id', 'DESC']]})
}

/**
 * @param {*} User
 * @returns Create User detail in sql database
 */
 async function store (user) {
  return MobileUser.create(user)
}

/**
 * @param {*} User
 * @returns Create User detail in sql database
 */
 async function findOne (userId) {
  return MobileUser.findOne({ where : {id: userId, is_deleted: false}})
} 
/**
 * @param {*} User
 * @returns Create User detail in sql database
 */
 async function findOnebByCode (query) {
  console.log(query, 'query');
  return MobileUser.findOne({ where: { reset_password_code: query.uuid, is_deleted: false } })
} 
/**
 * @param {*} User
 * @returns findOneByEmail User detail in sql database
 */
 async function findOneByEmail (user) {
  return MobileUser.findOne({ where: { [Op.or]: [{ email: user.email }], is_deleted: false } })
} 

/**
 * @param {*} User
 * @returns Create User detail in sql database
 */
 async function update (payload) {
  return MobileUser.findOne({ where: { id: payload.id, is_deleted: false} })
}

/**
 * @param {*} User
 * @returns Create User detail in sql database
 */
 async function destroy (userId) {
  return MobileUser.destroy({ where: { id: userId } })
}

/**
 * @param {*} verificationCreate
 * @returns Create User verification detail in sql database
 */
async function verificationCreate (verification) {
  return Verification.create(verification);
}

/**
 * @param {*} verificationCreate
 * @returns Create User verification detail in sql database
 */
 async function findOneVerification (query) {
  return Verification.findOne({ where: { account_verification_code: query.uuid, email_type: query.type, is_active: true, link_expiry_time: { [Op.gte]: new Date() } } })
}

/**
 * @param {*} updateForgetpasswordCode
 * @returns Create User updateForgetpasswordCode detail in sql database
 */
function updateForgetpasswordCode(verificationObject) {
  return MobileUser.findOne({ where: { id: verificationObject.user_id } })
    .then((user) => user.update({ reset_password_code: verificationObject.account_verification_code, reset_password_requested_on: new Date() }))
}