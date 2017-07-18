'use strict';
const AWS         = require('aws-sdk');
const secrets     = require('./secrets');

var environment = process.env.NODE_ENV || 'development';
if( global.TEST_MODE ) {
  environment = 'test'
}

module.exports = Object.assign({
  baseUrl:         'https://superserious.ngrok.io',
  awsRegion:       'us-west-2',
  usersTableName:  'disposableUsersStaging',
  photosTableName: 'disposablePhotosStaging',
  photosBucket:    'disposable.superserious.co-photos-staging',
  mailgunKey:      secrets.mailgunKey,
}, require(`./${environment}`));

AWS.config.update({
  accessKeyId:     secrets.awsAccessKey,
  secretAccessKey: secrets.awsSecretKey,
  region:          module.exports.awsRegion,
});

module.exports.AWS = AWS;
