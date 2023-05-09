'use strict';

var promise = require('bluebird');
var fs = promise.promisifyAll(require('fs'));
var handlebars = require('handlebars');
const config = require('../configuration/config');
const { EMAIL_VERIFICATION_TYPE, EMAIL_SUBJECT, EMAIL_TEMPLATE } = require('../helpers/constants');
const _ = require('lodash');
exports.compileTemplate = compileTemplate;
exports.createMessageForEmailVerification = createMessageForEmailVerification;
exports.createMessageToSendPassword = createMessageToSendPassword;
exports.startupFormSubmission = startupFormSubmission;


function compileTemplate(templateName, context) {
  return fs.readFileAsync(__dirname + `/emailtemplates/${templateName}.hbs`)
    .then((template) => handlebars.compile(template.toString())(context))
}

async function createMessageForEmailVerification(data) {
  let verifyEmail = data.linkType == EMAIL_VERIFICATION_TYPE.MODIFY_EMAIL;
  let modifyPassword = data.linkType == EMAIL_VERIFICATION_TYPE.MODIFY_PASSWORD;
  let resetPassword = data.linkType == EMAIL_VERIFICATION_TYPE.RESET_PASSWORD;
  let subjectLine = EMAIL_SUBJECT.VERIFY_EMAIL;
  if (verifyEmail) {
    subjectLine = EMAIL_SUBJECT.EMAIL_CHANGE_VERIFY;
  } else if (modifyPassword) {
    subjectLine = EMAIL_SUBJECT.PASSWORD_CHANGE_NOTIFICATION;
  } else if (resetPassword) {
    subjectLine = EMAIL_SUBJECT.PASSWORD_RESET;
  }
  let messageToSend = {
    sentBy: 'retail.hub',
    fromAddress: config.get('emailFromAddress'),
    toAddress: data.email,
    subject: subjectLine
  };
  let emailContext = {
    message: messageToSend,
    LINK: data.verificationLink,
    NAME: data?.first_name + ' ' + data?.last_name
  }
  let mailTemplate = EMAIL_TEMPLATE[data.linkType] || 'user_verification.email'
  //console.log(mailTemplate);
  //if (mailTemplate) return await generateDynamicMail(mailTemplate, emailContext, messageToSend, 'verification.email');
  return compileEmailTemplate(mailTemplate, emailContext, messageToSend);
}

function generateDynamicMail(mailTemplate, emailContext, messageToSend, defaultFile) {
  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + `/emailtemplates/${mailTemplate.email_type.toLowerCase()}.hbs`, mailTemplate.content, async function (err) {
      if (err) {
        console.log('error', error);
        resolve(compileEmailTemplate(defaultFile, emailContext, messageToSend))
      } else {
        messageToSend.subject = mailTemplate.subject;
        resolve(compileEmailTemplate(mailTemplate.email_type.toLowerCase(), emailContext, messageToSend));
      }
    });
  })

}

function compileEmailTemplate(fileName, emailContext, messageToSend) {
  return compileTemplate(fileName, emailContext)
    .then(function (compiledTemplate) {
      messageToSend.message = compiledTemplate;
      return messageToSend;
    })
}

async function createMessageToSendPassword(user, password) {
  let messageToSend = {
    sentBy: 'retail.hub',
    fromAddress: config.get('emailFromAddress'),
    toAddress: user.email,
    subject: EMAIL_SUBJECT.UPDATE_PASSWORD
  };
  let emailContext = {
    message: messageToSend,
    PASSWORD: password,
    USERNAME: user.username,
    NAME: user?.first_name + ' ' + user?.last_name
  }

  return compileEmailTemplate('send_password.email', emailContext, messageToSend);
  
}

async function startupFormSubmission(email, startup) {
  let messageToSend = {
    sentBy: 'RetailHub',
    fromAddress: config.get('emailFromAddress'),
    toAddress: email,
    subject: EMAIL_SUBJECT.STARTUP_FORM_SUBMISSION,
  };
  // console.log(messageToSend);
  let emailContext = {
    message: messageToSend,
    STARTUP_NAME: startup.name,
    NAME: startup.contact_name,
    EMAIL: startup.contact_email,
    JOBTITLE: startup.job_title,
    PHONE: startup.phone_number
  }
  let templateName = 'startup_notification.email';
  return compileEmailTemplate(templateName, emailContext, messageToSend);

}