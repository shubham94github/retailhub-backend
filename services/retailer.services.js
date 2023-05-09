'use strict'
const db = require('../app/models')
const Retailers = db.retailers

/**
 * @description In This file we have to create only user related logic function
 */

exports.store = store;


/**
 * @param {*} Retailers
 * @returns Create Retailers detail in sql database
 */
async function store (payload) {
  return Retailers.create(payload)
}
