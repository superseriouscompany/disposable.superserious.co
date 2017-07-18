const expect  = require('expect')
const factory = require('../lib/factory')
const api     = require('../lib/api')
const h       = require('../lib/helpers')

module.exports = function(ctx) {
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
          expect(err.response.body.error).toMatch(field)
        })
      })
    })
  });

  it('409s on same email and sends login', function() {
    const email = `neil${Math.random()}@superserious.co`
    var accessToken
    return factory.user({email: email}).then((u) => {
      accessToken = u.accessToken
      return factory.user({email: email})
    }).then(h.shouldFail).catch((err) => {
      expect(err.statusCode).toEqual(409)

      if( process.env.LIVE ) { return }
      expect(ctx.stub.calls.length).toEqual(1)
      const call = ctx.stub.calls[0]
      expect(call.url).toEqual('/mailgun')
      expect(call.body.from).toEqual('Disposable <hi@mg.superserious.co>')
      expect(call.body.to).toEqual(email)
      expect(call.body.subject).toEqual('Log-in information for your Disposable account')
      expect(call.body.text).toMatch('Click this link')
      expect(call.body.text).toMatch(accessToken)
      expect(call.body.html).toMatch('Click this link')
      expect(call.body.html).toMatch(accessToken)
    })
  })
}
