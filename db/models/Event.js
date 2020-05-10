const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number },
  image: { type: String },
  description: { type: String },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'eventCategory'
  }],

  isUniversityEvent: { type: Boolean, default: false },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'university'
  },

  eventDate: { type: Date },
  registrationStartDate: { type: Date, default: () => (Date.now()) },
  registrationEndDate: { type: Date },

  basicServices: [{
    title: { type: String, required: true }
  }],
  additionalServices: [{
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
  }],

  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
})

module.exports = mongoose.model('event', schema)
