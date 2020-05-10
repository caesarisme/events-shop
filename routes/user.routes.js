const router = require('express-promise-router')()

// Controller import
const Controller = require('../controllers/user.controller')

// Middleware
const { validateParam, validateBody, schemas } = require('../helpers/validation.helpers')
const { jwtRequired } = require('../helpers/jwt.helpers')

router.route('/data')
  .get(jwtRequired(), Controller.currentUserData)

router.route('/data/:userId')
  .get([jwtRequired(), validateParam('userId', schemas.idSchema)], Controller.userDataById)


module.exports = router