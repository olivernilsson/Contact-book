class Index {
  constructor() {
    this.body = document.querySelector("body")
    this.contacts = ""
    this.getContacts()
    this.setUpSections()
    //this.renderContactForm()
    this.addListeners()
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
    })

    listen("click", ".button-accept", async e => {
      this.createContact()
    })

    listen("click", ".add-contact", async e => {
      this.renderContactForm()
      this.removeContactView()
    })

    listen("click", ".button-cancel", async e => {
      this.removeContactForm()
    })
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

  renderContactList(contacts) {
    let contactList = document.querySelector(".contact-list")
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

    let contactContent = `
      <label class="first-name-label">Förnamn: ${contact.firstName}</label>
      <label class="first-name-label">Efternamn: ${contact.lastName}</label>
      <label class="first-name-label">Telefonnummer: ${contact.numbers.map(
        number => {
          return `<div>${number}</div>`
        }
      )}</label>
      <label class="first-name-label">Epostadresser: ${contact.emails}</label>
      `
    let main = document.querySelector(".main")
    //console.log(document.querySelector(".content-view"))

    let contactView = document.createElement("div")
    contactView.setAttribute("class", "contact-view")
    main.append(contactView)

    contactView.innerHTML = contactContent
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
      <div class="form-row">
        <label for="phone-number">Telefonnummer:</label>
        <input type="text" id="phone" name="phone" class="input-field phone-input">
      </div>
      <div class="form-row">
        <label for="email">Epostadress:</label>
        <input type="text" id="email" name="email" class="input-field email-input">
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
