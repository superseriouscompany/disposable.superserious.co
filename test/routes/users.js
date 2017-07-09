const expect  = require('expect')
const factory = require('../lib/factory')
const api     = require('../lib/api')
const h       = require('../lib/helpers')

module.exports = function() {
  var user;

  it("builds from factory", function () {
    return factory.user().then((u) => {
      expect(u.id).toExist(`Expected ${JSON.stringify(u)} to have an ID`)
      expect(u.accessToken).toExist(`Expected ${JSON.stringify(u)} to have an access token`)
    })
  });

  describe("errors on missing fields", function () {
    ['name', 'email'].forEach((field) => {
      it(`requires ${field}`, function() {
        var body = {}
        body[field] = null
        return factory.user(body).then(h.shouldFail).catch((err) => {
          expect(err.statusCode).toEqual(400)
          expect(err.response.body.message).toMatch(field)
        })
      })
    })
  });

  it('409s on same email', function() {
    return factory.user({email: 'nope@lame.com'}).then(() => {
      return factory.user({email: 'nope@lame.com'})
    }).then(h.shouldFail).catch((err) => {
      expect(err.statusCode).toEqual(409)
    })
  })
}
