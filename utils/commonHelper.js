const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
//const algorithm = 'AES256-GCM';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const key_new = 'g6ZOpvHQ78X4PbLzmU5eErPRtdh6mAXp';
const iv_new = 'o6SG75PDEbNTBYJV';


const encrypt = function (text) {
    var cipher = crypto.createCipheriv(algorithm,key_new,iv_new)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

const decrypt = function (text) {
    var decipher = crypto.createDecipheriv(algorithm,key_new,iv_new)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

const generateHashPassword = async(password)=>{
    let bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword
}

module.exports = {
    encrypt,
    decrypt,
    generateHashPassword
}