const { Schema, model } = require('mongoose')

const RiderSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 0.0 },
    location: { type: String, required: true },
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
    rides: [{ type: Schema.Types.ObjectId, ref: 'Ride' }],
    token: { type: String }
  },
  { timestamps: true }
)


module.exports = model('Rider', RiderSchema)
