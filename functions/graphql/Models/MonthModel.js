// @ts-check
// @ts-ignore
const { model, Schema } = require("mongoose");

const dbSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    start: {
      type: Number,
      default: 1,
    },
    end: {
      type: Number,
      default: 30,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Month", dbSchema);
