const AWS = require('aws-sdk');
require('dotenv').config()
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1', // e.g., 'us-east-1'
});

const db = new AWS.DynamoDB.DocumentClient();
const table="users"

module.exports={
    db,table
}