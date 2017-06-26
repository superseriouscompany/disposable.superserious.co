const models = {
  user: require('../models/user')
}

module.exports = function(app) {
  app.post('/users', function(req, res, next) {
    models.user.create(req.body).then((u) => {
      res.json(u)
    }).catch((err) => {
      next(err)
    })
  })
}
