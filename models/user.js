const shortid = require('shortid')
const uuid    = require('uuid')
const config  = require('../config')
const client  = require('../db/client')(config.AWS, config.dynamoEndpoint)

module.exports = {
  create: create,
}

function create(user) {
  user.id          = shortid.generate()
  user.createdAt   = user.createdAt || +new Date
  user.accessToken = uuid.v1()
  return client.putAsync({
    TableName: config.usersTableName,
    Item:      user,
  }).then(function() {
    return user
  })
}
