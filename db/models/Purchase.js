const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  total: { type: Number, required: true },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event'
  },
  additionalServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event.additionalServices'
  }]
})

module.exports = mongoose.model('purchase', schema)