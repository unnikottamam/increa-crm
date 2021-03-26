const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ClientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  createdByRole: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Client = mongoose.model("client", ClientSchema);
