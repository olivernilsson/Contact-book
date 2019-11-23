const mongoose = require("mongoose")
const Schema = mongoose.Schema

let contactSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  numbers: { type: Array },
  emails: { type: Array },
  version: { type: Number },
  history: { type: Array }
})

module.exports = mongoose.model("Contact", contactSchema)
