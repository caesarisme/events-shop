const express = require('express')
const config = require('config')
const logger = require('morgan')
const db = require('./db')
const mongoose = require('mongoose')

// Application
const app = express()

// Middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'))
}
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Route imports
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const eventRoutes = require('./routes/event.routes')

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)

// Catch 404 errors end forward then to error handler
app.use((req, res, next) => {
  const err = new Error('Not found')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {}
  const status = err.status || 500

  res.status(status).json({
    error: { message: error.message }
  })

  console.log(err)
})

const PORT = process.env.PORT || config.get('PORT') || 3000
db.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening port ${PORT}...`))
  })

module.exports = app