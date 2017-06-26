const request = require('request-promise')
const baseUrl = getBaseUrl()

const api = request.defaults({
  baseUrl:                 baseUrl,
  resolveWithFullResponse: true,
  json:                    true,
})

api.authenticated = function(accessToken) {
  return api.defaults({
    headers: { 'X-Access-Token': accessToken }
  });
}

api.baseUrl = baseUrl;

module.exports = api;

function getBaseUrl() {
  if( process.env.BASE_URL ) { return process.env.BASE_URL }

  return 'http://localhost:4200'
}
