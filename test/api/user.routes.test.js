const request = require('supertest')
const assert = require('chai').assert
const expect = require('chai').expect

const { v4: uuid } = require('uuid')
const app = require('../../app')

const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const User = require('../../db/models/User')

before(done => {
  mockgoose.prepareStorage().then(function() {
    mongoose.connect('mongodb://localhost:27017/TestingDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, err => {
      done(err)
    })
  })
})

after(done => {
  mongoose.disconnect()
    .then(() => done())
    .catch(err => done(err))
})

describe('User', () => {

  describe('Current user /data', () => {

    it('Status 200 with user authorized', async () => {
      const user = {
        phone: '87770000010',
        password: 'pass10',
        firstName: 'name',
        lastName: 'name'
      }

      // Register
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(user)

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ phone: user.phone, password: user.password })
      const { accessToken } = loginRes.body

      // Data
      const dataRes = await request(app)
        .get('/api/users/data')
        .set({'Authorization': `Bearer ${ accessToken }`})

      expect(dataRes.status).to.be.equal(200)
    })

    it('Status 401 without authorized user', async () => {
      const dataRes = await request(app)
        .get('/api/users/data')

      expect(dataRes.status).to.be.equal(401)
    })

    it('Response user is correct', async () => {
      const user = {
        phone: '87770000011',
        password: 'pass11',
        firstName: 'name',
        lastName: 'name'
      }

      // Register
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(user)

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ phone: user.phone, password: user.password })
      const { accessToken } = loginRes.body

      // Data
      const dataRes = await request(app)
        .get('/api/users/data')
        .set({'Authorization': `Bearer ${ accessToken }`})

      expect(dataRes.body).to.contain.property('_id')
      expect(dataRes.body).to.contain.property('role')
      expect(dataRes.body).to.contain.property('purchases')
      expect(dataRes.body).to.contain.property('events')
      expect(dataRes.body).to.contain.property('phone')
      expect(dataRes.body).to.contain.property('firstName')
      expect(dataRes.body).to.contain.property('lastName')
    })

    it('Response user does not contain password', async () => {
      const user = {
        phone: '87770000012',
        password: 'pass12',
        firstName: 'name',
        lastName: 'name'
      }

      // Register
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(user)

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ phone: user.phone, password: user.password })
      const { accessToken } = loginRes.body

      // Data
      const dataRes = await request(app)
        .get('/api/users/data')
        .set({'Authorization': `Bearer ${ accessToken }`})

      expect(dataRes.body).to.not.contain.property('password')
    })

  })

  describe('User data by id /data/:userId', () => {

    it('Status 200 on existing user', async () => {
      const firstUser = {
        phone: '87770000013',
        password: 'pass13',
        firstName: 'name',
        lastName: 'name'
      }

      const secondUser = {
        phone: '87770000014',
        password: 'pass14',
        firstName: 'name',
        lastName: 'name'
      }

      // Register
      await request(app)
        .post('/api/auth/register')
        .send(firstUser)

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ phone: firstUser.phone, password: firstUser.password })
      const { accessToken } = loginRes.body

      const newUser = new User(secondUser)
      const { _id: secondUserId } = await newUser.save()

      // Data
      const dataRes = await request(app)
        .get(`/api/users/data/${secondUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(dataRes.status).to.be.equal(200)
    })

    it('Status 404 on non existing user', async () => {
      const user = {
        phone: '87770000015',
        password: 'pass15',
        firstName: 'name',
        lastName: 'name'
      }

      // Register
      await request(app)
        .post('/api/auth/register')
        .send(user)

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ phone: user.phone, password: user.password })
      const { accessToken } = loginRes.body

      // Data
      const dataRes = await request(app)
        .get('/api/users/data/5eb5a36794d860bfe1c9f9a3')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(dataRes.status).to.be.equal(404)
    })

    it('Status 400 on invalid id format', async () => {
      const user = {
        phone: '87770000016',
        password: 'pass16',
        firstName: 'name',
        lastName: 'name'
      }

      // Register
      await request(app)
        .post('/api/auth/register')
        .send(user)

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ phone: user.phone, password: user.password })
      const { accessToken } = loginRes.body

      // Data
      const dataRes = await request(app)
        .get('/api/users/data/INVALID_ID')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(dataRes.status).to.be.equal(400)
    })

  })

})