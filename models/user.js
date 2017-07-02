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
    ['email', 'name'].forEach((field) => {
      if( !user[field] ) {
        throw new Error('ValidationError: `'+field+'` is required')
      }
    })
    if( users.find((u) => { return u.email === user.email }) ) {
      throw new Error('ConflictError: email is taken')
    }


    const id          = shortid.generate()
    const accessToken = shortid.generate()
    user.id           = id
    user.access_token = accessToken
    users.push(user)
    return user
  })
}