// @ts-check
const { model, Schema } = require('mongoose')

const { UserModel } = require('../user')

const dbSchema = new Schema(
  {
    amount: {
      type: Number,
      default: 0
    },
    detail: {
      type: String,
      default: ''
    },
    monthId: {
      type: Schema.Types.ObjectId,
      ref: 'Month'
    },
    year: {
      type: Number,
      default: new Date().getFullYear()
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

// @ts-ignore
dbSchema.pre('save', async function (next) {
  await UserModel.findOneAndUpdate(
    {
      _id: this.userId
    },
    {
      $inc: {
        total: this.amount
      }
    }
  )

  next()
})

module.exports = model('Entry', dbSchema)
