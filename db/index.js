const mongoose = require('mongoose');
const config = require('config')

const connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(config.get('MONGO_URL'), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
      .then((res, err) => {
        if (err) return reject(err)
        resolve()
      })
  })
}

const close = () => {
  return mongoose.disconnect()
}

module.exports = { connect, close }