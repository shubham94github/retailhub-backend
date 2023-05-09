'use strict';
var chalk = require('chalk');
let jwt = require('jsonwebtoken');
let config = require('../configuration/config');
let { ROLES } = require('../helpers/constants');
const UserService = require('../services/user.services')
let _ = require('lodash');
let promise = require('bluebird');
exports.isloggedInUser = isloggedInUser;
exports.isloggedInForAll = isloggedInForAll;
exports.createJWTToken = createJWTToken;
exports.isloggedInSuperAdminOnly = isloggedInSuperAdminOnly;
exports.isloggedInBothAdminSubAdmin = isloggedInBothAdminSubAdmin;
exports.isloggedInByClientMember = isloggedInByClientMember;
exports.isloggedInByMember = isloggedInByMember;
/**
 * @description This function is a middleware authenticate to check user is logged in or not on role basis 
 */
function isloggedInUser(request, response, next) {
    loggedInWithRoleBase(request, response, next, [ROLES.CLIENT]);
}

function isloggedInSuperAdminOnly(request, response, next) {
    loggedInWithRoleBase(request, response, next, [ROLES.SUPER_ADMIN]);
}

function isloggedInBothAdminSubAdmin(request, response, next) {
    loggedInWithRoleBase(request, response, next, [ROLES.SUPER_ADMIN, ROLES.SUB_ADMIN]);
}

function isloggedInForAll(request, response, next) {
    loggedInWithRoleBase(request, response, next, [ROLES.SUPER_ADMIN ]);
}

function isloggedInByClientMember(request, response, next) {
    loggedInWithRoleBase(request, response, next, [ROLES.CLIENT])
}
function isloggedInByMember(request, response, next) {
    loggedInWithRoleBase(request, response, next, [ROLES.MEMBER]);
}

/**
 * @description This is common function to check user roles is valid or not 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @param {*} roles 
 * @returns 
 */
async function loggedInWithRoleBase(request, response, next, roles) {
    let decryptToken = decryptAuthorizationToken(request, response);
    decryptToken = await checkLoggedInUserIsValid(decryptToken, response);
    // if (decryptToken && hasRequiredRole(decryptToken, roles)) {
    if (decryptToken) {
        request.user = decryptToken;
        return next();
    }
    return sendUnauthorisedResponse(response);
}

function checkLoggedInUserIsValid(decryptToken, response) {
    if (!decryptToken?.id) return sendUnauthorisedResponse(response);
    return UserService.findOne(decryptToken?.id).then((user) => {
        //if (!user || user?.role?.name != decryptToken?.userType) return sendUnauthorisedResponse(response);
        return decryptToken;
    })
}
/**
 * @description check user which roles is required for login
 * @param {*} user 
 * @param {*} roles 
 * @returns 
 */
function hasRequiredRole(user, roles) {
    return roles.find(type => type == user.role)
}

/**
 * @description Send response for unathorised user call the backend api.
 * @param {*} response 
 * @param {*} error 
 */
function sendUnauthorisedResponse(response, error) {
    console.log(chalk.red('Unauthorised access'));
    let responseContent = {
        message: 'Unauthorised',
        reason: getErrorReason(error)
    };
    response.status(403).send(responseContent);
}


function getErrorReason(error) {
    let reason = 'InvalidToken';
    if (error && error.name === 'TokenExpiredError') {
        reason = 'TokenExpired';
    }
    return reason;
}
/**
 * @description This function decrypt the authorization jwt token to get user detail
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */

function decryptAuthorizationToken(request, response) {
    let token = getToken(request);
    if (!token) return sendUnauthorisedResponse(response);
    try {
        return jwt.verify(token, config.get('authSecret'), { algorithms: ['HS256'] });
    } catch (error) {
        if ((error?.name === 'TokenExpiredError') && (request?.url.includes("/refresh-token"))) {
            return jwt.decode(token);
        }
        return sendUnauthorisedResponse(response, error);
    }
}

/**
 * @desction Get Token from authorization header
 * @param {*} request 
 * @returns 
 */
function getToken(request) {
    let bearerHeader = request.headers['authorization'];
    let token;
    if (bearerHeader) {
        let bearer = bearerHeader.split(' ');
        token = bearer[1];
    }
    return token;
}

/**
 * @description Create JWT token from user detail object
 * @param {*} userTokenObject 
 * @returns 
 */
function createJWTToken(userTokenObject) {
    return jwt.sign(userTokenObject, config.get('authSecret'), { expiresIn: 259200 });  //Token will expire 72 hours
}