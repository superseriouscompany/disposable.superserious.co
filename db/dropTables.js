const config  = require('../config')
const client  = require('./client')(config.AWS, config.dynamoEndpoint).lowLevel
const schemas = require('./schemas')

if( process.env.NODE_ENV == 'production' ) {
  return console.error("Won't automatically drop all prod tables");
}

schemas.forEach((s) => {
  const tableName = s.TableName

  client.deleteTable({TableName: tableName}, function(err, ok) {
    if( err ) {
      if( err.name == 'ResourceNotFoundException' ) {
        return console.log(tableName, "does not exist");
      }
      throw err;
    }
    console.log("Deleted", tableName);
  })
})
