const mongoose = require("mongoose");
const crypto= require("crypto");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ["admin", "user", "expert"],
    default: "user",
  },
  
  payment: { type: Boolean, default: false },
  expertiseIn:{type: String, default: ""},
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 18 },
  collegeName: {type: String, default: ""},
  GraduationYear: {type: Number, default: 0},
  YearAtCollege: {type: String, default: "Freshman"},
  createdAt: { type: Date, default: Date.now() },
  questions: [{ type: String, ref: "Question" }], // Reference to Question id
  maxQuestionsPerMonth: { type: Number, default: 13 },
  password: { type: String, required: true, minlength: 8, select: false },
  passwordresettoken: {type: String, default: ""},
  resettokenexpires: {type: Date, default: Date.now()},
  hasPaid: {type: Boolean, default: false},
  Paymentexpires: {type: Number, default:0},
  PaymentCreation: {type: Date, default: null},
  CustomerId: {type: String, default: ""},
  subject: [{type: String}]
});

userSchema.index({ email: "text" });

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordresettoken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resettokenexpires = Date.now() + 20 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
