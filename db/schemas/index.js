var schemas = []
require("fs").readdirSync(__dirname).forEach(function(file) {
  if( file === 'index.js') { return }
  schemas.push(require(`./${file}`))
});

module.exports = schemas
