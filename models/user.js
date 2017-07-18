const shortid = require('shortid')
const uuid    = require('uuid')
const config  = require('../config')
const client  = require('../db/client')(config.AWS, config.dynamoEndpoint)

module.exports = {
  create: create,
}

function create(user) {
  return Promise.resolve().then(() => {
    if( !user.name ) { throw new Error('ValidationError: name is required') }
    if( !user.email ) { throw new Error('ValidationError: email is required') }
    user.id          = shortid.generate()
    user.createdAt   = user.createdAt || +new Date
    user.accessToken = uuid.v1()
    return client.queryAsync({
      TableName: config.usersTableName,
      IndexName: 'email',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': user.email,
      },
      Limit: 1
    })
  }).then((conflict) => {
    if( conflict.Items.length > 1 ) {
      throw new Error('InternalConsistencyError: multiple emails returned for ' + user.email)
    }

    if( conflict.Items.length === 1 ) {
      var err  = new Error('ConflictError: email must be unique')
      err.user = conflict.Items[0]
      throw err
    }

    return client.putAsync({
      TableName: config.usersTableName,
      Item:      user,
    })
  }).then(() => {
    return user
  })
}
