// @ts-check
// @ts-ignore
const { model, Schema } = require('mongoose')

const dbSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item'
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

module.exports = model('Expense', dbSchema)
