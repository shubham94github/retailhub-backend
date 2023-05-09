'use strict';
var multer = require('multer');
var path = require('path');
const uploadPath = path.resolve(__dirname, '../uploads')
var generator = require('generate-password');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "article_image") {
            cb(null, uploadPath+'/article_image');
        } else if (file.fieldname === "image_src") {
            cb(null, uploadPath+'/startups');
        } else {
            cb(null, uploadPath)
        }
    },
    filename: function (req, file, cb) {
        let type = file?.mimetype.split('image/')[1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + type)
    }
})

exports.upload = multer({ storage: storage });

var supportingDocStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads')
    },
    filename: function (req, file, cb) {
        let orinalname = file.originalname.replace(/\.[^/.]+$/, "");
        cb(null, orinalname + '_' + Date.now() + path.extname(file.originalname));
    }
})
var stageDocumentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/stage_documents')
    },
    filename: function (req, file, cb) {
        let orinalname = file.originalname.replace(/\.[^/.]+$/, "");
        cb(null, orinalname + '_' + Date.now() + path.extname(file.originalname));
    }
})

const supportingDocUpload = multer({
    storage: supportingDocStorage,
    limits: { filesize: 20 },
    fileFilter(req, file, cb) {
        // if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx|webp|odt)$/)) {
        //     return cb(new Error('Please upload an valid image file'))
        // }
        cb(undefined, true)
    }
}).array('document')

const stageDocumentUpload = multer({
    storage: stageDocumentStorage,
    limits: { filesize: 20 },
    fileFilter(req, file, cb) {
        // if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx|webp|odt)$/)) {
        //     return cb(new Error('Please upload an valid image file'))
        // }
        cb(undefined, true)
    }
}).array('documents')

exports.supportingDocUpload = supportingDocUpload;
exports.stageDocumentUpload = stageDocumentUpload;

exports.generateRandomPassword = generateRandomPassword;

function generateRandomPassword() {
    let password = generator.generate({
        length: 5,
        numbers: true,
        uppercase: true,
        lowercase: true
    });
    return '!3' + password + 'M7#a';
}