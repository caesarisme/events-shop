const router = require('express-promise-router')()

// Controller import
const Controller = require('../controllers/auth.controller')

// Middleware
const { validateParam, validateBody, schemas } = require('../helpers/validation.helpers')

router.route('/register')
  .post(validateBody(schemas.userRegistration), Controller.register)

router.route('/login')
  .post(validateBody(schemas.userLogin), Controller.login)

router.route('/refresh')
  .post(validateBody(schemas.userRefresh), Controller.refresh)


module.exports = router