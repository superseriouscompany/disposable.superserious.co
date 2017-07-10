const config = require('../../config');

module.exports = {
  "TableName": config.usersTableName,
  "AttributeDefinitions":[
    {
      "AttributeName":"id",
      "AttributeType":"S"
    },
    {
      "AttributeName":"accessToken",
      "AttributeType":"S"
    },
    {
      "AttributeName":"email",
      "AttributeType":"S"
    },
  ],
  "KeySchema":[
    {
      "AttributeName":"id",
      "KeyType":"HASH"
    },
  ],
  "GlobalSecondaryIndexes":[
    {
      "IndexName": "accessToken",
      "KeySchema": [
        {
          "AttributeName": "accessToken",
          "KeyType": "HASH",
        },
      ],
      "Projection": {
        "ProjectionType": "ALL",
      },
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1,
      }
    },
    {
      "IndexName": "email",
      "KeySchema": [
        {
          "AttributeName": "email",
          "KeyType": "HASH",
        },
      ],
      "Projection": {
        "ProjectionType": "KEYS_ONLY",
      },
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1,
      }
    },
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits":1,
    "WriteCapacityUnits":1
  },
}
