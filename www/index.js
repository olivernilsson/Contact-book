class Index {
  constructor() {
    this.body = document.querySelector("body")
    this.setUpSections()
    this.getContacts()
  }

  setUpSections() {
    let header = document.createElement("header")
    header.setAttribute("class", "header")
    let title = document.createElement("h1")
    title.innerHTML = "Kontaktbok"
    title.setAttribute("class", "title")
    header.append(title)

    let main = document.createElement("main")
    main.innerHTML = "Hej! Jag är en main."
    main.setAttribute("class", "main")

    this.body.append(header)
    this.body.append(main)
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
