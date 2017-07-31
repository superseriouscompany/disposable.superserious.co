const expect  = require('expect')
const factory = require('../lib/factory')
const api     = require('../lib/api')
const h       = require('../lib/helpers')

module.exports = function() {
  var pass = {}

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
    return api.post('/albums/whatever/photos', {formData: {nope: 'nerp'}}).then(h.shouldFail).catch((err) => {
      expect(err.statusCode).toEqual(400)
      expect(err.response.body.message).toMatch('attach')
    })
  });

  it('uploads to s3')

  describe('albums', function () {
    it("returns posted photos", function () {
      var id, filename

      return factory.photo().then((photo) => {
        id = photo.id
        filename = photo.filename

        expect(photo.id && photo.filename).toExist(`Expected ${photo.id} and ${photo.filename} to exist`)
        return api('/albums/everyone/photos')
      }).then((response) => {
        expect(response.body.photos).toExist(`Expected photos in ${JSON.stringify(response.body)}`)
        const ids       = response.body.photos.map((p) => { return p.id } )
        const filenames = response.body.photos.map((p) => { return p.filename } )
        expect(ids).toContain(id)
        expect(filenames).toContain(filename)
      })
    });

    it("splits photos by album", function () {
      pass.albumName = Math.random()

      return Promise.all([
        factory.photo({albumName: pass.albumName}),
        factory.photo({albumName: 'nope'}),
      ]).then((v) => {
        pass.id = v[0].id
        return api(`/albums/${pass.albumName}/photos`)
      }).then((response) => {
        const photos = response.body.photos
        expect(photos).toExist(JSON.stringify(response.body))
        expect(photos.length).toEqual(1, JSON.stringify(response.body))
        expect(photos[0].id).toEqual(pass.id)
      })
    });
  });
}
