const { Schema, model } = require('mongoose')

const DriverSchema = new Schema(
    {
        riders: 
        [{ rider: { type: Schema.Types.ObjectId, ref='Rider'},
           location: { type: String, require: True } }],
        driver_id: { type: Schema.Types.ObjectId, ref='Driver' },
        status: { type: String, default: 'Scheduled', enum: ['Scheduled', 'Archived'] },
        destination: { type: String, require: True },
        startTime : { type: Date, require: True }
    },
    { timestamps: true }
)


module.exports = model('Driver', DriverSchema)