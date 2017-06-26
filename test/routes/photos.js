const expect  = require('expect')
const factory = require('../lib/factory')
const api     = require('../lib/api')
const h       = require('../lib/helpers')

module.exports = function() {
  it("builds from factory", function () {
    return factory.photo().then((photo) => {
      expect(photo.id).toExist(`Expected ${JSON.stringify(photo)} to have an ID`)
    })
  });

  it("400s on improper file type", function () {
    return factory.photo({
      file: `${__dirname}/../fixtures/nope.exe`
    }).then(h.shouldFail).catch((err) => {
      expect(err.statusCode).toEqual(400)
      expect(err.response.body.message).toMatch('valid png, jpeg or gif')
    })
  });

  it("400s on empty file", function () {
    return factory.photo({
      file: `${__dirname}/../fixtures/nope.jpg`
    }).then(h.shouldFail).catch((err) => {
      expect(err.statusCode).toEqual(400)
      expect(err.response.body.message).toMatch('empty')
    })
  });

  it("400s on missing file", function () {
    return api.post('/photos', {formData: {nope: 'nerp'}}).then(h.shouldFail).catch((err) => {
      expect(err.statusCode).toEqual(400)
      expect(err.response.body.message).toMatch('attach')
    })
  });
}
