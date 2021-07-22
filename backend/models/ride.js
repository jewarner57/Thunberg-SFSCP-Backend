const { Schema, model } = require('mongoose')

const RideSchema = new Schema(
  {
    riders:
      [{
        rider: { type: Schema.Types.ObjectId, ref: 'Rider' },
        location: { type: String, required: true }
      }],
    driver_id: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    status: { type: String, default: 'Scheduled', enum: ['Scheduled', 'Archived'] },
    destination: { type: String, required: true },
    startTime: { type: String, required: true }
  },
  { timestamps: true }
)


module.exports = model('Ride', RideSchema)