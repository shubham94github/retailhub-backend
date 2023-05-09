'use strict';
const config = require('../configuration/config');
const { uuid } = require('uuidv4');
exports.resetPasswordLink = resetPasswordLink;
exports.createEmailVerificationLink = createEmailVerificationLink;
exports.createForgetPasswordVerificationLink = createForgetPasswordVerificationLink;

function resetPasswordLink(uuid) {
    let link = '/password/update/' + uuid;
    return updateRelativeLink(link);
}

function createEmailVerificationLink(action) {
    return function (data) {
        data = addUUIDAndLinkType(data, action);
        data.verificationLink = `${config.get('emailLinkBase')}/verify/user/${data.uuid}/${action}`;
        return data;
    }
}

function createForgetPasswordVerificationLink(action) {
    return function (data) {
        data = addUUIDAndLinkType(data, action);
        data.verificationLink = `${config.get('emailLinkBase')}/reset/password/${data.uuid}/${action}`;
        return data;
    }
}

function addUUIDAndLinkType(data, action) {
    if (data?.uuid) return data;
    data.uuid = uuid();
    data.linkType = action;
    return data;
}
