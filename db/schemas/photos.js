const config = require('../../config');

module.exports = {
  "TableName": config.photosTableName,
  "AttributeDefinitions":[
    {
      "AttributeName":"groupId",
      "AttributeType":"S"
    },
    {
      "AttributeName":"id",
      "AttributeType":"N"
    },
  ],
  "KeySchema":[
    {
      "AttributeName":"groupId",
      "KeyType":"HASH",
    },
    {
      "AttributeName":"id",
      "KeyType":"RANGE",
    }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits":1,
    "WriteCapacityUnits":1
  },
}
