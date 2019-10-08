const mongoose = require("mongoose")
const Schema = mongoose.Schema

let contactSchema = new Schema({
  name: { type: String, required: true }
})

module.exports = mongoose.model("Contact", contactSchema)
