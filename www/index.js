class Index {
  constructor() {
    this.setUpSections()
    this.getContacts()
  }

  setUpSections() {
    let body = document.querySelector("body")
    let div = document.createElement("div")
    div.innerHTML = "Hej! Jag är en div."
    body.append(div)
  }

  addListeners() {}

  getContacts = async () => {
    let contacts = await fetch("/api/contacts")
    contacts = await contacts.json()
    console.log(contacts)
    return contacts
  }
}

new Index()
