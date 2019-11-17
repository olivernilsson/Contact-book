class Index {
  constructor() {
    this.body = document.querySelector("body")
    this.contacts = ""
    this.getContacts()
    this.setUpSections()
    this.addListeners()
    this.currentId = ""
    this.currentContact = ""
  }

  setUpSections() {
    let header = document.createElement("header")
    header.setAttribute("class", "header")
    let title = document.createElement("h1")
    title.innerHTML = "Kontaktbok"
    title.setAttribute("class", "title")

    let main = document.createElement("main")
    main.setAttribute("class", "main")

    let contactList = document.createElement("div")
    contactList.setAttribute("class", "contact-list")

    this.body.append(header)
    header.append(title)

    this.body.append(main)

    main.append(contactList)
  }

  addListeners() {
    listen("click", ".list-item", async e => {
      await this.renderContact(e.target.id)
      this.removeContactForm()
      this.removeUpdateForm()
      this.currentId = e.target.id
    })

    listen("click", ".button-accept", async e => {
      this.createContact()
      await this.getContacts()
      this.removeContactForm()
      await this.renderContact(await this.getLatestContactId())
    })

    listen("click", ".add-contact", async e => {
      this.renderContactForm()
      this.removeContactView()
      this.removeUpdateForm()
    })

    listen("click", ".button-cancel", async e => {
      this.removeContactForm()
      this.removeUpdateForm()
    })

    listen("click", ".button-edit", async e => {
      this.removeContactForm()
      this.removeContactView()
      this.renderEditContact()
    })

    listen("click", ".button-edit-accept", async e => {
      await this.updateContact(this.currentContact)
      this.removeUpdateForm()
      await this.renderContact(this.currentId)
    })

    listen("click", ".button-add-phone", async e => {
      this.addPhoneField()
    })

    listen("click", ".button-add-email", async e => {
      this.addEmailField()
    })
  }

  addPhoneField = () => {
    let phoneField = document.createElement("input")
    phoneField.setAttribute("class", "input-field phone-input")
    document.querySelector(".phone-row").append(phoneField)
  }

  addEmailField = () => {
    let emailField = document.createElement("input")
    emailField.setAttribute("class", "input-field phone-input")
    document.querySelector(".email-row").append(emailField)
  }

  getContacts = async () => {
    let contacts = await fetch("/api/contacts")
    contacts = await contacts.json()
    await this.renderContactList(contacts)
  }

  getContact = async id => {
    let contact = await fetch(`/api/contacts/id/${id}`)
    contact = await contact.json()
    return await contact
  }

  getLatestContactId = async id => {
    let contact = await fetch(`/api/contact/latest`)
    contact = await contact.json()
    console.log(contact[0]._id)
    return await contact[0]._id
  }

  createContact = async () => {
    let newContact = {}
    let number = [document.querySelector(".phone-input").value]
    let email = [document.querySelector(".email-input").value]
    newContact.firstName = document.querySelector(".first-name-input").value
    newContact.lastName = document.querySelector(".last-name-input").value
    newContact.numbers = number
    newContact.emails = email
    newContact.history = {
      firstName: newContact.firstName,
      lastName: newContact.lastName,
      numbers: newContact.numbers,
      emails: newContact.emails
    }

    let rawFetchData = await fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newContact)
    })
  }

  updateContact = async contact => {
    let updatedContact = { ...contact }
    let numbers = [...document.querySelectorAll(".phone-input")].map(
      number => number.value
    )
    let emails = [...document.querySelectorAll(".email-input")].map(
      email => email.value
    )
    updatedContact.firstName = document.querySelector(".first-name-input").value
    updatedContact.lastName = document.querySelector(".last-name-input").value
    updatedContact.numbers = numbers
    updatedContact.emails = emails

    let historyObj = { ...updatedContact }
    delete historyObj.history
    updatedContact.history.push({ ...historyObj })

    let rawFetchData = await fetch("/api/contacts/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedContact)
    })
  }

  renderContactList(contacts) {
    let contactList = document.querySelector(".contact-list")
    contactList.innerHTML = ""
    console.table(contacts)

    contacts.map(contact => {
      return (contactList.innerHTML += this.contactListItem(
        contact.firstName,
        contact.lastName,
        contact._id
      ))
    })
    contactList.innerHTML += `
    <div class="add-contact">
      <label class="list-label">Lägg till kontakt+</label>
    </div>
    `
  }

  async renderContact(id) {
    this.removeContactView()

    let contact = await this.getContact(id)

    this.currentId = id

    let contactContent = `
      <label class="first-name-label contact-label">Förnamn: ${
        contact.firstName
      }</label>
      <label class="first-name-label contact-label">Efternamn: ${
        contact.lastName
      }</label>
      <label class="first-name-label contact-label">Telefonnummer: ${contact.numbers.map(
        number => {
          return `<div>${number}</div>`
        }
      )}</label>
      <label class="first-name-label contact-label">Epostadresser: ${
        contact.emails
      }</label>
      <button class="button-edit">Redigera</button>
      <i class="fas fa-undo-alt undo"></i>
      <i class="fas fa-redo-alt redo"></i>
      `
    let main = document.querySelector(".main")
    //console.log(document.querySelector(".content-view"))

    let contactView = document.createElement("div")
    contactView.setAttribute("class", "contact-view")
    main.append(contactView)

    contactView.innerHTML = contactContent
  }

  async renderEditContact() {
    let contact = await this.getContact(this.currentId)

    this.currentContact = contact

    let updateForm = document.createElement("div")
    updateForm.setAttribute("class", "update-form")

    let main = document.querySelector(".main")
    main.append(updateForm)

    updateForm = document.querySelector(".update-form")

    let formContent = `
    <div>
      <div class="form-row">
        <label for="first-name">Förnamn:</label>
        <input type="text" id="first-name" name="first-name" class="input-field first-name-input" value=${contact.firstName}>
      </div>
      <div class="form-row">
        <label for="last-name">Efternamn:</label>
        <input type="text" id="last-name" name="last-name" class="input-field last-name-input" value=${contact.lastName}>
      </div>
      <div class="form-row phone-row">
        <label for="phone-number">Telefonnummer:</label>
        <input type="text" id="phone" name="phone" class="input-field phone-input" value=${contact.numbers}>
        <button class="button-add-phone">+</button>
      </div>
      <div class="form-row email-row">
        <label for="email">Epostadress:</label>
        <input type="text" id="email" name="email" class="input-field email-input" value=${contact.emails}>
        <button class="button-add-email">+</button>
      </div>
      <div class="form-button-container">
        <button class="button-cancel">Avbryt</button>
        <button class="button-edit-accept">Godkänn</button>
      </div>
    </div>
    `

    updateForm.innerHTML = formContent
  }

  removeContactForm() {
    let contactForm = document.querySelector(".contact-form")
    if (contactForm) {
      contactForm.remove()
    }
  }

  removeContactView() {
    let contactView = document.querySelector(".contact-view")
    if (contactView) {
      contactView.remove()
    }
  }

  removeUpdateForm() {
    let updateForm = document.querySelector(".update-form")
    if (updateForm) {
      updateForm.remove()
    }
  }

  contactListItem(firstName, lastName, id) {
    let listItem = `
    <div class="list-item">
      <label class="list-label" id="${id}">${firstName + " " + lastName}</label>
    </div>
    `
    return listItem
  }

  renderContactForm() {
    let contactForm = document.createElement("div")
    contactForm.setAttribute("class", "contact-form")

    let main = document.querySelector(".main")
    main.append(contactForm)

    contactForm = document.querySelector(".contact-form")

    let formContent = `
    <div>
      <div class="form-row">
        <label for="first-name">Förnamn:</label>
        <input type="text" id="first-name" name="first-name" class="input-field first-name-input">
      </div>
      <div class="form-row">
        <label for="last-name">Efternamn:</label>
        <input type="text" id="last-name" name="last-name" class="input-field last-name-input">
      </div>
      <div class="form-row phone-row">
        <label for="phone-number">Telefonnummer:</label>
        <input type="text" id="phone" name="phone" class="input-field phone-input">
        <button class="button-add-phone">+</button>
      </div>
      <div class="form-row email-row">
        <label for="email">Epostadress:</label>
        <input type="text" id="email" name="email" class="input-field email-input">
        <button class="button-add-email">+</button>
      </div>
      <div class="form-button-container">
        <button class="button-cancel">Avbryt</button>
        <button class="button-accept">Godkänn</button>
      </div>
    </div>
    `

    contactForm.innerHTML = formContent
  }
}

const [listen, unlisten] = (() => {
  let listeningOnType = {}
  let listeners = []

  function listen(eventType, cssSelector, func) {
    // Register a "listener"
    let listener = { eventType, cssSelector, func }
    listeners.push(listener)
    // If no listener on window[eventType] register a
    // a real/raw js-listener
    if (!listeningOnType[eventType]) {
      // add event listener for this type on the whole window
      window.addEventListener(eventType, e => {
        listeners
          .filter(x => x.eventType === eventType)
          .forEach(listener => {
            if (e.target.closest(listener.cssSelector)) {
              listener.func(e)
            }
          })
      })
      listeningOnType[eventType] = true
    }
    return listener
  }

  function unlisten(listener) {
    listeners.splice(listeners.indexOf(listener), 1)
  }

  return [listen, unlisten]
})()

new Index()
