const fs  = require('fs')
const api = require('./api')

module.exports = {
  photo: (params) => {
    params = Object.assign({
      file: `${__dirname}/../fixtures/photo.jpg`
    }, params)

    const formData = {
      photo: fs.createReadStream(params.file),
    }

    return api.post('/photos', {formData: formData}).then((r) => {
      return r.body
    })
  },

  user: (params) => {
    params = Object.assign({
      name: 'Sancho Panza',
      email: `sanchopanza${Math.random()}@gmail.com`,
    }, params)

    return api.post('/users', {body: params}).then((r) => {
      return r.body
    })
  }
}
