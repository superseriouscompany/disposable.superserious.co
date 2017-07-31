const shortid = require('shortid')
const uuid    = require('uuid')
const config  = require('../config')
const client  = require('../db/client')(config.AWS, config.dynamoEndpoint)

module.exports = {
  create:        create,
  all:           all,
  findByGroupId: findByGroupId,
}

function all() {
  return client.scanAsync({
    TableName: config.photosTableName
  }).then((payload) => {
    return payload.Items
  })
}

function findByGroupId(groupId) {
  return client.queryAsync({
    TableName:                 config.photosTableName,
    KeyConditionExpression:    'groupId = :groupId',
    ExpressionAttributeValues: {
      ':groupId': groupId
    },
  }).then((payload) => {
    return payload.Items
  })
}

function create(photo) {
  return Promise.resolve().then(() => {
    photo.id      = +new Date
    photo.groupId = photo.groupId || 'everyone'
  }).then(() => {
    return client.putAsync({
      TableName: config.photosTableName,
      Item:      photo,
    })
  }).then(() => {
    return photo
  })
}
