const router = require('express-promise-router')()

// Controller import
const Controller = require('../controllers/event.controller')

// Middleware
const { jwtRequired } = require('../helpers/jwt.helpers')
const { validateParam, validateBody, schemas } = require('../helpers/validation.helpers')

router.route('/')
  .post([jwtRequired(['organizer']), validateBody(schemas.createEvent)], Controller.createEvent)
  .get(Controller.test)


module.exports = router