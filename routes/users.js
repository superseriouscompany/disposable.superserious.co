const auth = require('../middleware/auth')
const models = {
  user:    require('../models/user'),
  mailgun: require('../models/mailgun'),
}

module.exports = function(app) {
  app.post('/users', create)
  app.get('/me', auth, get)
  app.patch('/me', auth, update)
}

function create(req, res, next) {
  return models.user.create(req.body).then((user) => {
    res.json(user)
  }).catch((err) => {
    if( err.message.match(/^ValidationError/) ) {
      return res.status(400).json({error: err.message})
    }
    if( err.message.match(/^ConflictError/) ) {
      return models.mailgun.send({
        to:   req.body.email,
        text: `Someone (hopefully you!) tried to log in to Disposable. Click this link on your phone to log in: disposable://s/${err.user.accessToken}`,
        html: `Someone (hopefully you!) tried to log in to Disposable. Click this link on your phone to log in: <a href="disposable://s/${err.user.accessToken}">disposable://s/${err.user.accessToken}</a>`,
        subject: 'Log-in information for your Disposable account',
      }).then(() => {
        return res.status(409).json({error: err.message})
      }).catch(next)
    }
    next(err)
  })
}

function update(req, res, next) {
  const user = Object.assign({}, req.body, {id: req.user.id})
  return models.user.update(user).then(() => {
    return res.sendStatus(204)
  }).catch(next)
}

function get(req, res, next) {
  return res.json({
    name: req.user.name,
  })
}
