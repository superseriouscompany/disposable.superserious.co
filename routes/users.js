const models = {
  user: require('../models/user')
}

module.exports = function(app) {
  app.post('/users', function(req, res, next) {
    models.user.create(req.body).then((u) => {
      res.status(201).json(u)
    }).catch((err) => {
      if( err.message.match(/^ValidationError/) ) {
        return res.status(400).json({message: err.message})
      }
      if( err.message.match(/^ConflictError/) ) {
        return res.status(409).json({message: err.message})
      }
      next(err)
    })
  })
}
