const mongoose = require("mongoose")
const connectionString = require("./connectionString.js")

const connectToDb = () => {
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))

  global.db = mongoose.connection
}

module.exports = connectToDb
