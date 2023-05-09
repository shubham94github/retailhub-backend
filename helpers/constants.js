'use strict';
const USER_VERIFICATION = 'USER_VERIFICATION';
const SEND_PASSWORD = 'SEND_PASSWORD';
const MODIFY_EMAIL = 'MODIFY_EMAIL';
const MODIFY_PASSWORD = 'MODIFY_PASSWORD';
const RESET_PASSWORD = 'RESET_PASSWORD';
const RESEND_VERIFICATION = 'RESEND_VERIFICATION';
const STARTUP_FORM_SUBMISSION= 'STARTUP_FORM_SUBMISSION';
exports.EMAIL_VERIFICATION_TYPE = getEmailVerificationConstants();
exports.EMAIL_SUBJECT = getEmailSubject();
exports.EMAIL_TEMPLATE = getEmailTemplate();
exports.ROLES = getUsersRole();
exports.REGEX = getRegexConstatns();

exports.SELF = 'self';
exports.DOCUMENT_TYPE = {
    SINGLE: 'Single',
    MULTIPLE: 'Multiple'
}

function getUsersRole() {
    return {
        CLIENT: 'client',
        SUB_ADMIN: 'subadmin',
        SUPER_ADMIN: 'ADMIN',
        MEMBER: 'member'
    }
}

function getRegexConstatns() {
    return {
        EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        PASSWORD: /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,12}$/,
        NAME: /^[a-zA-Z ]*$/,
        USERNAME: /^(?=[a-zA-Z0-9._]{3,12}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
        CONTACT_NO:  /^(?:\+?(61))? ?(?:\((?=.*\)))?(0?[2-57-8])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})$/,
        UUID: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    }
}

function getEmailSubject() {
    return {
        PASSWORD_CHANGE_NOTIFICATION: 'The password from this account has been changed',
        EMAIL_CHANGE_VERIFY: 'Change of email address - please verify',
        PASSWORD_RESET: 'Retailhub password reset',
        VERIFY_EMAIL: 'Please verify your email address',
        UPDATE_PASSWORD: 'Retailhub account password',
        STARTUP_FORM_SUBMISSION: 'New Coca cola form receive'
    }
}
function getEmailTemplate() {
    // let listTemplate = [
    //     { subject: "", content: "", email_type: ""},
    //     { subject: "", content: "", email_type: ""},
    //     { subject: "", content: "", email_type: ""},
    //     { subject: "", content: "", email_type: ""},
    // ]
    // return listTemplate
    return {
        USER_VERIFICATION: 'user_verification.email',
        //MODIFY_EMAIL: 'modify_email',
       // MODIFY_PASSWORD: 'modify_password.email',
        RESEND_VERIFICATION: 'resend_verification.email',
        RESET_PASSWORD: 'reset_password.email',
        SEND_PASSWORD: 'send_password.email',
        STARTUP_FORM_SUBMISSION: 'startup_notification.email'
    }
}
function getEmailVerificationConstants() {
    return {
        USER_VERIFICATION,
        MODIFY_EMAIL,
        MODIFY_PASSWORD,
        RESEND_VERIFICATION,
        RESET_PASSWORD,
        SEND_PASSWORD,
        STARTUP_FORM_SUBMISSION
    }
}