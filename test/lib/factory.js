const fs  = require('fs')
const api = require('./api')

module.exports = {
  photo: (params) => {
    params = Object.assign({}, {
      file: `${__dirname}/../fixtures/photo.jpg`,
      albumName: 'everyone',
    }, params)

    const formData = {
      photo: fs.createReadStream(params.file),
    }

    return api.post(`/albums/${params.albumName}/photos`, {formData: formData}).then((r) => {
      return r.body
    })
  },

  user: (params) => {
    params = Object.assign({
      email: `sanchopanza${Math.random()}@gmail.com`,
    }, params)

    return api.post('/users', {body: params}).then((r) => {
      const user = r.body
      Object.defineProperty(user, 'api', {
        get: function() {
          return api.authenticated(user.accessToken)
        }
      })
      return user
    })
  }
}
