const express = require("express")
const Contact = require("../schemas/Contact")

const router = express.Router()

router.get("/api/contacts", async (req, res) => {
  Contact.find({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

module.exports = router
