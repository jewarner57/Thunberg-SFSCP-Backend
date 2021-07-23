const bcrypt = require('bcryptjs')
const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "Driver"
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: "Rider"
    },
    token: { type: String }
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', function (next) {
  const user = this;

  // If the password was not changed
  if (!user.isModified('password')) {
    return next();
  }

  // Hash password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      console.log(err)
      next();
    });
  });
});

// Compare password equality
userSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

module.exports = model('User', userSchema)
