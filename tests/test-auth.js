require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app.js')

const { assert } = chai

const User = require('../models/user.js')
const Rider = require('../models/rider.js')
const Driver = require('../models/driver.js')

chai.config.includeStack = true

const { expect } = chai
const should = chai.should()
chai.use(chaiHttp)

const agent = chai.request.agent(app)

/**
 * root level hooks
 */
let riderID = ''
let driverID = ''

after((done) => {
  Driver.deleteOne({ _id: driverID })
    .then(() => {
      Rider.deleteOne({ _id: riderID })
        .then(() => {
          mongoose.models = {}
          mongoose.modelSchemas = {}
          mongoose.connection.close()
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    .catch((err) => {
      done(err)
    })
})

let userId = ''

describe('User API endpoints', () => {

  // Create a sample user for use in tests.
  beforeEach((done) => {
    const sampleUser = new User({
      email: 'user@test.com',
      password: 'mypassword',
    })

    userId = sampleUser._id

    sampleUser.save()
      .then(() => {
        agent
          .post('/user/signin')
          .send({ email: 'user@test.com', password: 'mypassword' })
          .then((res) => {
            done()
          })
          .catch((err) => {
            done(err)
          })
      })
      .catch((err) => {
        done(err)
      })
  })

  // Delete sample user.
  afterEach((done) => {
    User.deleteMany({ email: ['test@user.com', 'user@test.com', 'another@test.com', 'updatedUser@test.com'] })
      .then(() => {
        done()
      }).catch((err) => {
        done(err)
      })
  })

  // POST Signup
  it('should sign up a new user', (done) => {
    chai.request(app)
      .post('/user/signup')
      .send({ email: 'another@test.com', password: 'mypassword' })
      .end((err, res) => {
        if (err) { done(err) }
        expect(res).to.have.status(200)
        expect(res.body.user).to.be.an('object')
        expect(res.body.user).to.have.property('email', 'another@test.com')
        expect(res).to.have.cookie('authToken');

        // check that user is actually inserted into database
        User.findOne({ email: 'another@test.com' })
          .then((user) => {
            expect(user).to.be.an('object')
            done()
          }).catch((err) => {
            done(err)
          })
      })
  })

  // POST Signout
  it('should be able to sign in', (done) => {

    chai.request(app)
      .post('/user/signin')
      .send({ email: 'user@test.com', password: 'mypassword' })
      .end((err, res) => {
        if (err) { done(err) }

        expect(res).to.have.status(200)
        expect(res).to.have.cookie('authToken');
        expect(res.body.message).to.be.equal('Login Successful')
        done();
      })
  });

  // POST Signout
  it('should be able to sign out', (done) => {
    agent
      .post('/user/signout')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res).to.not.have.cookie('authToken')
        expect(res.body.message).to.be.equal('Logout Successful')
        done();
      });
  });

  // POST Create Rider Profile
  it('should be able to create a rider profile', (done) => {
    agent
      .post('/user/rider-info')
      .send({
        name: "Testing Rider Name",
        location: "555 Post St. San Francisco California",
        phone: "123-456-7890"
      })
      .end((err, res) => {
        res.should.have.status(200);
        // Set riderID for deletion after test
        riderID = res.body.rider._id
        expect(res.body.rider).to.have.property('name', 'Testing Rider Name')
        expect(res.body.rider).to.have.property('location', '555 Post St. San Francisco California')
        expect(res.body.rider).to.have.property('phone', '123-456-7890')
        done();
      });
  });

  // POST Create Driver Profile
  it('should be able to create a driver profile', (done) => {
    agent
      .post('/user/driver-info')
      .send({
        name: "Testing Driver Name",
        maxRiders: 3,
        phone: "123-456-7890"
      })
      .end((err, res) => {
        res.should.have.status(200);
        // Set driverID for deletion after test
        driverID = res.body.driver._id
        expect(res.body.driver).to.have.property('name', 'Testing Driver Name')
        expect(res.body.driver).to.have.property('maxRiders', 3)
        expect(res.body.driver).to.have.property('phone', '123-456-7890')
        done();
      });
  });
})