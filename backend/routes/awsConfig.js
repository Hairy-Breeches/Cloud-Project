// awsConfig.js
const AWS = require('aws-sdk');
const env = require('dotenv').config();


AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIASHHEGQE5WTLVTU42',
  secretAccessKey: '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',
});

module.exports = AWS;
