const jwt = require('jsonwebtoken')
const config = require('config')

// Model imports
const User = require('../db/models/User')

module.exports = {
  currentUserData: async (req, res) => {
    const { _id: userId } = req.user
    const userToResponse = await User.findById(userId, '-password')

    res.status(200).json(userToResponse)
  },

  userDataById: async (req, res) => {
    const { userId } = req.validated.params
    const user = await User.findById(userId, {
      balance: 1,
      role: 1,
      purchases: 1,
      events: 1,
      phone: 1,
      firstName: 1,
      lastName: 1,
      password: -1
    })

    if (!user) {
      return res.sendStatus(404)
    }

    res.status(200).json(user)
  }
}