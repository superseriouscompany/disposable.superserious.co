const expect  = require('expect')
const factory = require('../lib/factory')
const api     = require('../lib/api')
const h       = require('../lib/helpers')

module.exports = function() {
  var user;

  it("builds from factory", function () {
    return factory.user().then((u) => {
      expect(u.id).toExist(`Expected ${JSON.stringify(u)} to have an ID`)
      expect(u.access_token).toExist(`Expected ${JSON.stringify(u)} to have an access token`)
    })
  });
}
