// @ts-check
// @ts-ignore
const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const dbSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 80,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      min: 10,
      max: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
    estimate: {
      type: Number,
      default: 0,
    },
    expense: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isLock: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// @ts-ignore
dbSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

dbSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

module.exports = model("User", dbSchema);
