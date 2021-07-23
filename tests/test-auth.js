require('dotenv').config()
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app.js')

const { assert } = chai

const User = require('../models/user.js')

chai.config.includeStack = true

const { expect } = chai
const should = chai.should()
chai.use(chaiHttp)

const agent = chai.request.agent(app)

/**
 * root level hooks
 */
after((done) => {
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
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
            console.log(res.body.message)
            done()
          })
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
        expect(res).to.have.cookie('nToken');

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
})

// POST Login
it('should be able to sign in', (done) => {
  chai.request(app)
    .post('/user/signin')
    .send({ email: 'user@test.com', password: 'mypassword' })
    .end((err, res) => {
      if (err) { done(err) }

      expect(res).to.have.status(200)
      expect(res).to.have.cookie('nToken');
      expect(res.body.message).to.be.equal('Login Successful')
      done();
    })
});

// POST Logout
it('should be able to sign out', (done) => {
  agent
    .post('/user/signout')
    .end((err, res) => {
      res.should.have.status(200);
      expect(res).to.not.have.cookie('nToken')
      expect(res.body.message).to.be.equal('Logout Successful')
      done();
    });
});
