const config  = require('../config')
const client  = require('./client')(config.AWS, config.dynamoEndpoint).lowLevel
const schemas = require('./schemas')

schemas.forEach((s) => {
  client.createTable(s, function(err) {
    if( err ) {
      if( err.code === 'ResourceInUseException' ) {
        return console.log(`${s.TableName} already exists.`)
      }
      throw err
    }
    console.log("Created", s.TableName)
  })
})
