const Joi = require('joi')
  // .extend(require('@hapi/joi-date'))

module.exports = {
  validateParam: (name, schema) => {
    return (req, res, next) => {
      const result = Joi.validate({ param: req['params'][name] }, schema)

      if (result.error) {
        return res.status(400).json(result.error)
      }

      if (!req.validated) {
        req.validated = { params: {} }
      }

      req.validated['params'][name] = result.value.param
      next()
    }
  },

  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema)

      if (result.error) {
        return res.status(400).json(result.error)
      }

      if (!req.validated) {
        req.validated = { body: {} }
      }

      req.validated['body'] = result.value
      next()
    }
  },

  schemas: {
    idSchema: Joi.object().keys({
      param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    userRegistration: Joi.object().keys({
      phone: Joi.string().regex(/^[0-9]{11}$/).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required()
    }),

    userLogin: Joi.object().keys({
      phone: Joi.string().regex(/^[0-9]{11}$/).required(),
      password: Joi.string().required()
    }),

    userRefresh: Joi.object().keys({
      refreshToken: Joi.string().regex(/^[0-9a-zA-Z-]{36}$/).required()
    }),

    createEvent: Joi.object().keys({
      title: Joi.string().required(),
      price: Joi.number(),
      image: Joi.string().required(),
      description: Joi.string().required(),
      categories: Joi.array().items(
        Joi.string().regex(/^[0-9a-fA-F]{24}$/)
      ).min(1).unique().required(),

      isUniversityEvent: Joi.boolean().required(),
      university: Joi.object().keys({
        _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
      }).unknown(),

      eventDate: Joi.date(),
      registrationStartDate: Joi.date(),
      registrationEndDate: Joi.date(),

      basicServices: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().required()
        })
      ).min(1).unique().required(),

      additionalServices: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().required(),
          price: Joi.number().required(),
          description: Joi.string().required()
        })
      ),

      organizer: Joi.object().keys({
        _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
      }).unknown().required(),
    })
  }
}