global.TEST_MODE = true
const expect     = require('expect')
const api        = require('./lib/api')

describe("disposable api", function() {
  this.slow(1000)
  this.timeout(2000)

  var handle;
  before(() => {
    handle = require('../')(4200)
  })

  after(() => {
    handle()
  })

  var routesPath = `${__dirname}/routes`
  require('fs').readdirSync(routesPath).forEach((file) => {
    const fileName = file.split('.')[0]
    describe(fileName, require(`${routesPath}/${file}`))
  })
})
