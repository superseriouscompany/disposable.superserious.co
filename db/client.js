const promisifyAll = require('bluebird').promisifyAll;

module.exports = function(AWS, endpoint) {
  AWS = AWS || require('aws-sdk')

  // TODO: check for region
  const lowLevel = new AWS.DynamoDB(endpoint)
  var client     = new AWS.DynamoDB.DocumentClient(endpoint)

  client = promisifyAll(client)

  client.truncate = function(tableName, schema) {
    return new Promise(function(resolve, reject) {
      lowLevel.deleteTable({ TableName: tableName }, function(err) {
        if( err && err.name != 'ResourceNotFoundException' ) { console.error(err.name); return reject(err); }

        waitForDeletion(tableName, function(err) {
          if( err ) { return reject(err); }

          lowLevel.createTable(schema, function(err) {
            if( err ) { return reject(err); }

            waitForCreation(tableName, function(err) {
              if( err ) { return reject(err); }
              resolve(true);
            })
          })
        })
      })
    })
  }

  client.lowLevel = lowLevel

  return client

  function waitForDeletion(tableName, cb) {
    lowLevel.describeTable({
      TableName: tableName,
    }, function(err, cool) {
      if( !err ) {
        return setTimeout(function() {
          waitForDeletion(tableName, cb);
        }, 1000);
      }
      if( err.name != 'ResourceNotFoundException' ) {
        return cb(err);
      }
      cb();
    })
  }

  function waitForCreation(tableName, cb) {
    lowLevel.describeTable({
      TableName: tableName,
    }, function(err, data) {
      if( err ) { return cb(err); }
      if( data.Table.TableStatus != 'ACTIVE' ) {
        return setTimeout(function() {
          waitForCreation(tableName, cb);
        }, 1000);
      }
      cb();
    })
  }
}
