class Index {
  constructor() {
    this.body = document.querySelector("body")
    this.contacts = ""
    this.getContacts()
    this.setUpSections()
    this.renderContactForm()
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

    let contactForm = document.createElement("form")
    contactForm.setAttribute("class", "contact-form")

    this.body.append(header)
    header.append(title)

    this.body.append(main)

    main.append(contactList)

    main.append(contactForm)
  }

  contactListItem(firstName, lastName, id) {
    let listItem = `
    <div class="list-item">
      <label class="list-label" id="${id}">${firstName + " " + lastName}</label>
    </div>
    `
    return listItem
  }

  addListeners() {
    listen("click", ".list-item", async e => {
      let contact = await this.getContact(e.target.id)
      console.log(contact)
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
  }

  renderContactForm() {
    let contactForm = document.querySelector(".contact-form")

    let formContent = `
    <div>
      <div class="form-row">
        <label for="first-name">Förnamn:</label>
        <input type="text" id="first-name" name="first-name" class="input-field">
      </div>
      <div class="form-row">
        <label for="last-name">Efternamn:</label>
        <input type="text" id="last-name" name="last-name" class="input-field">
      </div>
      <div class="form-row">
        <label for="phone-number">Telefonnummer:</label>
        <input type="text" id="phone" name="phone" class="input-field">
      </div>
      <div class="form-row">
        <label for="email">Epostadress:</label>
        <input type="text" id="email" name="email" class="input-field">
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
