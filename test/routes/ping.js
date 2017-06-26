const api    = require('../lib/api')
const expect = require('expect')

module.exports = () => {
  it("works", function () {
    return api('/').then((r) => {
      expect(r.body.version).toEqual(1, `Expected version 1 in ${JSON.stringify(r.body)}`)
    })
  });
}
