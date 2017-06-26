const express    = require('express')
const bodyParser = require('body-parser')
const app        = express()
const port       = process.env.PORT || 3000

app.use(bodyParser.json())

app.use(express.static('photos'))

app.get('/', (req, res) => {
  res.json({version: 1})
})

var routesPath = `${__dirname}/routes`
require('fs').readdirSync(routesPath).forEach((file) => {
  require(`${routesPath}/${file}`)(app)
})

if( process.env.NODE_ENV != 'production' && global.TEST_MODE ) {
  module.exports = function(port) {
    const ref    = app.listen(port);
    const handle = ref.close.bind(ref);
    return handle;
  }
  return;
}

app.use(function(err, req, res, next) {
  console.error(err)
  res.status(500).json({message: 'Something went wrong.'});
})

app.listen(port, () => {
  console.log(`Listening on ${port}...`)
})
