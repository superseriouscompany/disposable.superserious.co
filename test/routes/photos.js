const expect  = require('expect')
const factory = require('../lib/factory')

module.exports = function() {
  it("builds from factory", function () {
    return factory.photo().then((response) => {
      expect(response.statusCode).toEqual(200)
    })
  });

  it("validates file type", function () {

  });

  it("400s on missing file", function () {

  });
}
