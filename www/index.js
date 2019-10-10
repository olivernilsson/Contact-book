class Index {
  constructor() {
    this.body = document.querySelector("body")
    this.contacts = ""
    this.getContacts()
    this.setUpSections()
    this.renderContactForm()
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

  contactListItem(firstName, lastName) {
    let listItem = `
    <div class="list-item">
      <label class="list-label">${firstName + " " + lastName}</label>
    </div>
    `
    return listItem
  }

  addListeners() {}

  getContacts = async () => {
    let contacts = await fetch("/api/contacts")
    contacts = await contacts.json()
    await this.renderContactList(contacts)
  }

  renderContactList(contacts) {
    let contactList = document.querySelector(".contact-list")
    console.table(contacts)

    contacts.map(contact => {
      return (contactList.innerHTML += this.contactListItem(
        contact.firstName,
        contact.lastName
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
    </div>
    `

    contactForm.innerHTML = formContent
  }
}

new Index()
