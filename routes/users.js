const models = {
  user:    require('../models/user'),
  mailgun: require('../models/mailgun'),
}

module.exports = function(app) {
  app.post('/users', create)
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
