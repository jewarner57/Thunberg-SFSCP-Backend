const { Schema, model } = require('mongoose')

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        driver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Driver"
        },
        rider: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Rider"
        },
        token: { type: String }
    },
    { timestamps: true }
)


module.exports = model('User', userSchema)
