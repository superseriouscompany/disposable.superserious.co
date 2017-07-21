const models = {
  user: require('../models/user')
}

module.exports = (req, res, next) => {
  if( !req.get('X-Access-Token') ) {
    return res.status(401).json({error: 'No Access Token Provided'})
  }

  return models.user.findByAccessToken(req.get('X-Access-Token')).then((user) => {
    req.user = user
    next()
  }).catch(next)
}
