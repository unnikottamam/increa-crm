const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var leadSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  referrer: {
    type: String
  },
  tag: {
    type: String,
    default: "review"
  },
  isarchive: {
    type: Boolean,
    default: false
  },
  todelete: {
    type: Boolean,
    default: false
  },
  editedBy: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  editedByRole: {
    type: String
  },
  editedByDate: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Lead = mongoose.model("lead", leadSchema);
