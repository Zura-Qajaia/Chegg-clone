const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  subject: { type: String, required: true, index: true },
  questionText: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "selecting", "working", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  answer: { type: String },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
