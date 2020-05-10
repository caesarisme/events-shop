const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
})

module.exports = mongoose.model('university', schema)