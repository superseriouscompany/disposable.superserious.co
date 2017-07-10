const models = {
  user: require('../models/user'),
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
      return res.status(409).json({error: err.message})
    }
    next(err)
  })
}
