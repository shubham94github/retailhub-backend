const templateService = require("./template.service");
let environment = require("../configuration/environment");
const chalk = require("chalk");
var nodemailer = require("nodemailer");
var config = require("../configuration/config");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: config.get("email"),
    pass: "tauukllcgmpfhjlt"
  }
});
// if (!environment.isProduction()) {
//     transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 465,
//         auth: {
//             user: config.get('email'),
//             pass: 'jtxnwvbhgrhbuwbz'
//         }
//     })
// }

exports.createMessage = createMessage;
exports.sendEmail = sendEmail;

function createMessage(messageObject) {
  return templateService
    .compileTemplate(messageObject.templateName, messageObject)
    .then(generateMailObject(messageObject));
}

function generateMailObject(messageObject) {
  return function (templateMessage) {
    return {
      from: messageObject.fromAddress,
      to: Array.isArray(messageObject.toAddress)
        ? messageObject.toAddress.join(",")
        : messageObject.toAddress,
      subject: messageObject.subject,
      html: templateMessage
    };
  };
}

function sendEmail(message) {
  var email = {
    from: message.fromAddress,
    to: Array.isArray(message.toAddress)
      ? message.toAddress.join(",")
      : message.toAddress,
    subject: message.subject,
    html: message.message
  };
  let emailToSend = updateStandardMessageForEnvironment(email);
  return transporter
    .sendMail(emailToSend)
    .then((response) => {
      console.log("mail sent:", response);
      return message;
    })
    .catch((error) => console.log("node mailer error->", error));
}

function updateStandardMessageForEnvironment(email) {
  if (!environment.isProduction()) {
    messageStart =
      "Email service is in development mode and will redirect email sent to ";
    return updateSendAddress(email, messageStart);
  }

  if (!config.get("deliverEmails")) {
    messageStart =
      "Email service is in production mode but the deliverEmails flag is " +
      "false, so redirecting email sent to ";
    return updateSendAddress(email, messageStart);
  }
  return email;
}

function updateSendAddress(email, messageStart) {
  var updatedAddress = config.get("emailFromAddress");
  console.log(chalk.red(messageStart + email.to + " to " + updatedAddress));
  email.to = updatedAddress;
  delete email.cc;
  return email;
}
