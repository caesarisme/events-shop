const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event'
  }]
})

module.exports = mongoose.model('eventCategory', schema)