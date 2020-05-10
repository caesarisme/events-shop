const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  phone: { type: String, unique: true, require: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  balance: { type: Number, default: 0 },
  role: { type: String, default: 'customer' }, // customer/organizer/shopper/admin

  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'university'
  },

  purchases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'purchase'
  }],

  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event'
  }]
})

module.exports = mongoose.model('user', schema)