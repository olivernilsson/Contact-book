const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const connectToDb = require("./db")
const contactRoutes = require("./API/contactRoutes")

connectToDb()

const app = express()

app.use(bodyParser.json())

app.use(express.static("www"))

app.use(contactRoutes)

app.listen(3000, () => console.log(`Server is on port 3000`))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./www/index.html"))
})
