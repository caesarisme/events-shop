const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('config')
const { v4: uuid } = require('uuid')

// Model imports
const User = require('../db/models/User')
const RefreshToken = require('../db/models/RefreshToken')

const { issueToken } = require('../helpers/jwt.helpers')

module.exports = {
  register: async (req, res) => {
    const { phone, password, firstName, lastName } = req.validated.body
    const candidate = await User.findOne({ phone }).lean()
    if (candidate) {
      return res.sendStatus(409)
    }

    const newUser = new User({
      phone,
      password: bcrypt.hashSync(password, 10),
      firstName,
      lastName
    })

    await newUser.save()

    res.sendStatus(201)
  },

  login: async (req, res) => {
    const { phone, password } = req.validated.body
    const candidate = await User.findOne({ phone }).lean()

    if (candidate && bcrypt.compareSync(password, candidate.password)) {
      const { _id: sub } = candidate
      const accessToken = issueToken({ sub }, { expiresIn: config.get('ACCESS_TOKEN_EXP') })
      const refreshToken = uuid()

      await (new RefreshToken({ sub, token: refreshToken })).save()

      return res.status(200).json({ accessToken, refreshToken })
    }

    res.sendStatus(401)
  },

  refresh: async (req, res) => {
    const { refreshToken } = req.validated.body
    const dbToken = await RefreshToken.findOne({ token: refreshToken })

    if (dbToken) {
      const { sub } = dbToken.sub
      const accessToken = issueToken({ sub }, { expiresIn: config.get('ACCESS_TOKEN_EXP') })
      const refreshToken = uuid()

      await dbToken.remove()

      return res.status(200).json({ accessToken, refreshToken })
    }

    res.sendStatus(404)
  }
}