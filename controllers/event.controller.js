// Model imports
const Event = require('../db/models/Event')
const EventCategory = require('../db/models/EventCategory')
const User = require('../db/models/User')
const University = require('../db/models/University')

module.exports = {
  createEvent: async (req, res) => {
    const user = req.user
    const newEvent = new Event(req.validated.body)
    await newEvent.save()

    res.sendStatus(201)
  },

  getEventsForUser: async (req, res) => {
    // const user = req.user
  },

  test: async (req, res) => {

  }
}