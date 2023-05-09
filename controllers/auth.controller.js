const request = require('superagent');
const responseHelper = require('../helpers/responseHelper.js');
const AuthValidator = require('../helpers/validators/linkedin-login.validator');
// Constand
const urlToGetLinkedInAccessToken = 'https://www.linkedin.com/oauth/v2/accessToken';
const urlToGetUserProfile ='https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))'
const urlToGetUserEmail = 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))';

exports.loginByLinkedin = loginByLinkedin;

/**
 * @description This function use to create new client by admin and subadmin
 * @method loginByLinkedin
 * @url api/create/article
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
 function loginByLinkedin(request, response, next) {
    var handleError = responseHelper.createErrorHandler(request, response, next);
    var sendResponse = responseHelper.createResponseHandler(request, response, 200);
    const payload = {
        code : req.query.code,
        state: req.query.state
    };
    return AuthValidator.validateLinkedingLogin(payload, response)
        .then(requestAccessToken(payload))
        .then((accessToken) => getUserProfile(accessToken))
        .then((accessToken)=> getUserEmail(accessToken))
        .then(userBuilder())
        .then(sendResponse)
        .catch(handleError)
}
/**
 * Get access token from LinkedIn
 * @param code returned from step 1
 * @returns accessToken if successful or null if request fails 
 */
 function requestAccessToken({code,state}) {
    return request.post(urlToGetLinkedInAccessToken)
      .send('grant_type=authorization_code')
      .send(`redirect_uri=${process.env.REDIRECT_URI}`)
      .send(`client_id=${process.env.CLIENT_ID}`)
      .send(`client_secret=${process.env.CLIENT_SECRET}`)
      .send(`code=${code}`)
      .send(`state=${state}`)
  }

/**
 * Get user first and last name and profile image URL
 * @param accessToken returned from step 2
 */
function getUserProfile(accessToken) {
    return request.get(urlToGetUserProfile)
    .set('Authorization', `Bearer ${accessToken}`)
}


/**
 * Get user email
 * @param accessToken returned from step 2
 */
function getUserEmail(accessToken) {
    return request.get(urlToGetUserEmail)
    .set('Authorization', `Bearer ${accessToken}`)
}

/**
 * Build User object
 */
function userBuilder(userProfile, userEmail) {
  return {
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    profileImageURL: userProfile.profileImageURL,
    email: userEmail
  }
}

