const config  = require('../config')
const apiKey  = config.mailgunKey
const domain  = 'mg.superserious.co'
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain})

module.exports = {
  send: send,
}

function send(data) {
  return Promise.resolve().then(() => {
    if( !data.subject || (!data.text && !data.html) ) {
      throw(`ValidationError: need subject and text or html in ${JSON.stringify(data)}`)
    }

    data = Object.assign({
      from: 'Disposable <hi@mg.superserious.co>',
      to: 'bug-emptyemail@superserious.co',
      html: data.html || data.text,
      text: data.text || data.html,
    }, data)


    return global.TEST_MODE && !process.env.LIVE
      ? stubRequest(data)
      : liveRequest(data)
  })
}

function stubRequest(data) {
  return require('request-promise')('http://localhost:4201/mailgun', {
    method: 'POST',
    body:   data,
    json:   true,
  })
}

function liveRequest(data) {
  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, (err, body) => {
      if( err ) { return reject(err) }
      resolve(body)
    })
  })
}
