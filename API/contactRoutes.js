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

router.get("/api/contacts/id/:id", async (req, res) => {
  Contact.findById(req.params.id).then(data => {
    res.status(200).send(data)
  })
})

router.post("/api/contacts/", async (req, res) => {
  let contact = new Contact(req.body)
  await contact.save()
  res.status(200).send(contact)
})

router.put("/api/contacts/edit/", async (req, res) => {
  let contact = await Contact.findById(req.body._id)
  contact.firstName = req.body.firstName
  contact.lastName = req.body.lastName
  contact.numbers = req.body.numbers
  contact.emails = req.body.emails
  contact.history = req.body.history

  await contact.save()
  res.status(200).send(contact)
})

router.delete("/api/contacts/id/:id/delete", async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  contact.delete(function(err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send()
    }
  })
})

module.exports = router
