const shortid = require('shortid')
const uuid    = require('uuid')
const config  = require('../config')
const client  = require('../db/client')(config.AWS, config.dynamoEndpoint)

module.exports = {
  create:            create,
  update:            update,
  get:               get,
  findByAccessToken: findByAccessToken,
}

function create(user) {
  return Promise.resolve().then(() => {
    if( !user.email ) { throw new Error('ValidationError: email is required') }
    user.id          = shortid.generate()
    user.createdAt   = user.createdAt || +new Date
    user.accessToken = uuid.v1()
    return client.queryAsync({
      TableName:                 config.usersTableName,
      IndexName:                 'email',
      KeyConditionExpression:    'email = :email',
      ExpressionAttributeValues: {
        ':email': user.email,
      },
      Limit:                     1
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

function update(user) {
  return Promise.resolve().then(() => {
    var updateExpression = 'set'
    var attributeNames   = {}
    var attributeValues  = {}
    var valid = false;
    ['name'].forEach(function(field) {
      if( user[field] ) {
        attributeNames[`#${field}`]  = field
        attributeValues[`:${field}`] = user[field]
        updateExpression += `#${field} = :${field},`
        valid = true
      }
    })
    if( !valid ) { throw new Error('InputError: no valid fields provided')}
    updateExpression = updateExpression.substring(0,updateExpression.length - 1);
    return client.updateAsync({
      TableName:                 config.usersTableName,
      Key:                       { id: user.id },
      ConditionExpression:       `attribute_exists(id)`,
      UpdateExpression:          updateExpression,
      ExpressionAttributeValues: attributeValues,
      ExpressionAttributeNames:  attributeNames,
    })
  }).catch((err) => {
    if( err.name == 'ConditionalCheckFailedException' ) {
      throw new Error('NotFound')
    }
    throw err
  })
}

function get(id) {
  return Promise.resolve().then(() => {
    return client.getAsync({
      TableName: config.usersTableName,
      Key:       { id: id }
    })
  }).then((payload) => {
    if( !payload.Item ) { throw new Error('NotFound: user not found') }
    return payload.Item
  })
}

function findByAccessToken(accessToken) {
  return client.queryAsync({
   TableName:                 config.usersTableName,
   IndexName:                 'accessToken',
   KeyConditionExpression:    'accessToken = :accessToken',
   ExpressionAttributeValues: {
     ':accessToken': accessToken
   },
   Limit:                     1,
 }).then(function(user) {
   if( !user.Items.length ) { throw new Error('NotFound: user not found') }
   return user.Items[0]
 })
}
