const request = require('supertest')
const assert = require('chai').assert
const expect = require('chai').expect

const { v4: uuid } = require('uuid')
const bcrypt = require('bcrypt')
const app = require('../../app')

const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const User = require('../../db/models/User')
const Event = require('../../db/models/Event')
const EventCategory = require('../../db/models/EventCategory')
const University = require('../../db/models/University')

before(done => {
  // Create some categories
  const eventCategories = ['☀️ Летние', '❄️ Зимние', '🗻️ Походы', '🎉 Развлечения']
  eventCategories.forEach(async title => {
    const dbC = new EventCategory({ title })
    await dbC.save()
  })
  // Create some unviersities
  const universities = ['SDU', 'KBTU', 'Kazgasa', 'Kaznu', 'Kimep']
  universities.forEach(async title => {
    const dbU = new University({ title })
    await dbU.save()
  })

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

describe('Event', () => {

  describe('POST / - create new event', () => {

    it('Status 201 on correct data format', async () => {
      const user = new User({
        phone: "87770000030",
        password: bcrypt.hashSync('pass', 10),
        firstName: 'John',
        lastName: 'Doe',
        role: 'organizer'
      })
      const { id: universityId } = await University.findOne({ title: 'SDU' })
      user.university = universityId
      await user.save()
      const dbUser = await User.findOne({ phone: user.phone }).populate('university')

      const event = {
        title: 'Any title',
        price: 3000,
        description: 'Lorem ipsum',
        image: 'https://aps-polymer.com/wp-content/uploads/2019/09/placeholder-300x200.png',
        categories: [],
        basicServices: [
          { title: 'service1' },
          { title: 'service2' },
          { title: 'service3'}
        ],
        additionalServices: [
          { title: 'aService1', price: 1000, description: 'desc1' },
          { title: 'aService2', price: 2000, description: 'desc2' },
          { title: 'aService3', price: 3000, description: 'desc3' }
        ],
        isUniversityEvent: true,
        eventDate: new Date(),
        registrationStartDate: new Date(),
        registrationEndDate: new Date(),
        organizer: dbUser
      }
      const { id: firstCategoryId } = await EventCategory.findOne({title: '☀️ Летние'})
      const { id: secondCategoryId } = await EventCategory.findOne({title: '❄️ Зимние'})
      event.categories.push(firstCategoryId)
      event.categories.push(secondCategoryId)
      event.university = dbUser.university

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ phone: user.phone, password: 'pass' })
      const { accessToken } = loginRes.body

      // Create event
      const createRes = await request(app)
        .post('/api/events/')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(event)

      expect(createRes.status).to.be.equal(201)
    })

    it('Status 400 on incorrect data format', async () => {
      const user = new User({
        phone: "87770000031",
        password: bcrypt.hashSync('pass', 10),
        firstName: 'John',
        lastName: 'Doe',
        role: 'organizer'
      })
      await user.save()

      const event = {
        title: 'Any title'
      }

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ phone: user.phone, password: 'pass' })
      const { accessToken } = loginRes.body

      // Create event
      const createRes = await request(app)
        .post('/api/events/')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(event)

      expect(createRes.status).to.be.equal(400)
    })

    it('Status 403 on not permitted user post', async () => {
      const user = new User({
        phone: "87770000032",
        password: bcrypt.hashSync('pass', 10),
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer'
      })
      const dbUser = await user.save()

      const event = {
        title: 'Any title',
        price: 3000,
        description: 'Lorem ipsum',
        image: 'https://aps-polymer.com/wp-content/uploads/2019/09/placeholder-300x200.png',
        categories: [],
        basicServices: [
          { title: 'service1' },
          { title: 'service2' },
          { title: 'service3'}
        ],
        additionalServices: [
          { title: 'aService1', price: 1000, description: 'desc1' },
          { title: 'aService2', price: 2000, description: 'desc2' },
          { title: 'aService3', price: 3000, description: 'desc3' }
        ],
        isUniversityEvent: false,
        eventDate: new Date(),
        registrationStartDate: new Date(),
        registrationEndDate: new Date(),
        organizer: dbUser
      }
      const { id: firstCategoryId } = await EventCategory.findOne({title: '☀️ Летние'})
      const { id: secondCategoryId } = await EventCategory.findOne({title: '❄️ Зимние'})
      event.categories.push(firstCategoryId)
      event.categories.push(secondCategoryId)
      event.university = dbUser.university

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ phone: user.phone, password: 'pass' })
      const { accessToken } = loginRes.body

      // Create event
      const createRes = await request(app)
        .post('/api/events/')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(event)

      expect(createRes.status).to.be.equal(403)
    })

  })

})