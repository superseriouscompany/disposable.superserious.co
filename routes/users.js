const models = {
  user: require('../models/user'),
}

module.exports = function(app) {
  app.post('/users', create)
}

function create(req, res, next) {
  return models.user.create(req.body).then((user) => {
    res.json(user)
  }).catch(next)
}
