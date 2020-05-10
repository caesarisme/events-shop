const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  sub: { type: String, required: true },
  token: { type: String, required: true }
})

module.exports = mongoose.model('refreshToken', schema)