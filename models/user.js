const shortid = require('shortid')

var users = []

module.exports = {
  create: create,
  all: all,
}

function all() {
  return Promise.resolve(users)
}

function create(user) {
  return Promise.resolve().then(() => {
    const id          = shortid.generate()
    const accessToken = shortid.generate()
    user.id           = id
    user.access_token = accessToken
    users.push(user)
    return user
  })
}
