const { Schema, model } = require('mongoose')

const DriverSchema = new Schema(
  {
    name: { type: String, required: true },
    maxRiders: { type: Number, default: 3 },
    rating: { type: Number, default: 0.0 },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required: [true, 'Phone number required']
    },
    driverRides: [{ type: Schema.Types.ObjectId, ref: 'Ride' }],
    token: { type: String }
  },
  { timestamps: true }
)


module.exports = model('Driver', DriverSchema)