const request = require('supertest')
const assert = require('chai').assert
const expect = require('chai').expect

const { v4: uuid } = require('uuid')
const app = require('../../app')

const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

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

describe('Auth', () => {

  describe('/register', () => {
    it('Status 201 on correct data', done => {
      request(app)
        .post('/api/auth/register')
        .send({
          phone: '87770000001',
          password: 'pass1',
          firstName: 'name1',
          lastName: 'name1'
        })
        .expect(201)
        .end(done)
    })

    it('Status 400 on incorrect data format', done => {
      request(app)
        .post('/api/auth/register')
        .send({
          phone: '87770000002',
          password: 'pass2',
          firstName: 'name2'
        })
        .expect(400)
        .end(done)
    })

    it('Status 409 on registration existing user', done => {
      request(app)
        .post('/api/auth/register')
        .send({
          phone: '87770000003',
          password: 'pass3',
          firstName: 'Kaisar',
          lastName: 'Kaisar'
        })
        .expect(201)
        .end(() =>
          request(app)
            .post('/api/auth/register')
            .send({
              phone: '87770000003',
              password: 'pass3',
              firstName: 'Kaisar',
              lastName: 'Kaisar'
            })
            .expect(409)
            .end(done)
        )
    })
  })

  describe('/login', () => {
    it('Status 200 on correct credentials', done => {
      request(app)
        .post('/api/auth/register')
        .send({
          phone: '87770000004',
          password: 'pass4',
          firstName: 'name1',
          lastName: 'name1'
        })
        .end(() => {
          request(app)
            .post('/api/auth/login')
            .send({
              phone: '87770000004',
              password: 'pass4'
            })
            .expect(200)
            .end(done)
        })
    })

    it('Status 401 on invalid credentials', done => {
      request(app)
        .post('/api/auth/login')
        .send({
          phone: '87770000005',
          password: 'pass5'
        })
        .expect(401)
        .end(done)
    })

    it('Status 400 on invalid data format', done => {
      request(app)
        .post('/api/auth/login')
        .send({
          phone: '87770000005'
        })
        .expect(400)
        .end(done)
    })

    it('Gets access and refresh tokens on success login', done => {
      request(app)
        .post('/api/auth/register')
        .send({
          phone: '87770000007',
          password: 'pass7',
          firstName: 'name1',
          lastName: 'name1'
        })
        .then(() => {
          request(app).post('/api/auth/login')
            .send({
              phone: '87770000007',
              password: 'pass7'
            })
            .then(res => {
              expect(res.body).to.contain.property('accessToken')
              expect(res.body).to.contain.property('refreshToken')
              done()
            })
            .catch(err => done(err))
        })
    })
  })

  describe('/refresh', () => {
    it('Status 200 on correct body', async () => {
      const user = {
        phone: '87770000008',
        password: 'pass8',
        firstName: 'name1',
        lastName: 'name1'
      }

      const registerRes = await request(app).post('/api/auth/register')
        .send(user)

      const loginRes = await request(app).post('/api/auth/login')
        .send({ phone: user.phone, password: user.password })

      const { accessToken, refreshToken } = loginRes.body

      const refreshRes = await request(app).post('/api/auth/refresh')
        .send({ refreshToken })

      expect(refreshRes.status).to.be.equal(200)
    })

    it('Tokens change after refresh', async () => {
      const user = {
        phone: '87770000009',
        password: 'pass9',
        firstName: 'name1',
        lastName: 'name1'
      }

      const registerRes = await request(app).post('/api/auth/register')
        .send(user)

      const loginRes = await request(app).post('/api/auth/login')
        .send({ phone: user.phone, password: user.password })

      const { accessToken, refreshToken } = loginRes.body

      const refreshRes = await request(app).post('/api/auth/refresh')
        .send({ refreshToken })

      expect(refreshRes.body.accessToken).to.not.equal(accessToken)
      expect(refreshRes.body.refreshToken).to.not.equal(refreshToken)
    })

    it('Status 404 on invalid refresh token refresh', async () => {
      const refreshRes = await request(app).post('/api/auth/refresh')
        .send({ refreshToken: uuid() })

      expect(refreshRes.status).to.be.equal(404)
    })
  })

})