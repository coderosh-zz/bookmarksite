// QuerySelectors
const addBtn = document.querySelector('.add-btn')
const lists = document.querySelector('#lists')
const form = document.querySelector('.form')
const backdrop = document.querySelector('#backdrop')

class Site {
  constructor(id, name, site) {
    this.id = id
    this.name = name
    this.site = site
  }
}

class UI {
  static displayForm = e => {
    e.preventDefault()
    form.classList.add('display-form')
    backdrop.style.display = 'block'
  }

  static hideForm = e => {
    e.preventDefault()
    form.classList.remove('display-form')
    backdrop.style.display = 'none'
  }

  static addSite = ({ id, name, site }) => {
    const li = document.createElement('li')
    li.className = 'list-item'
    li.id = id
    li.innerHTML = `
        <div class="site-title">${name}</div>
        <a href="${site}" target="_blank" class="site-visit">Visit</a>
        <div class="site-rm">&#10005</div>
    `
    lists.insertAdjacentElement('beforeend', li)
  }

  static deleteSite = id => {
    document.getElementById(id).remove()
  }
}

class Storage {
  static addToLs(data) {
    localStorage.setItem('sites', JSON.stringify(data))
  }

  static getFromLs() {
    if (localStorage.getItem('sites') === null) {
      return []
    }

    return JSON.parse(localStorage.getItem('sites'))
  }
}

class App {
  data = Storage.getFromLs()

  init() {
    this.data.forEach(site => {
      UI.addSite(site)
    })

    // Event Listeners
    addBtn.addEventListener('click', UI.displayForm)

    backdrop.addEventListener('click', UI.hideForm)

    form.addEventListener('submit', this.formSubmitHandler)

    lists.addEventListener('click', this.deleteHandler)
  }

  idGenerator() {
    if (this.data.length === 0) {
      return 0
    } else {
      return this.data[this.data.length - 1].id + 1
    }
  }

  formSubmitHandler = e => {
    UI.hideForm(e)
    let id = this.idGenerator()

    let url = this.validateSite(e.target.name.value, e.target.site.value)

    if (!url) {
      return
    }

    const site = new Site(id, e.target.name.value, url)
    e.target.name.value = ''
    e.target.site.value = ''

    this.data.push(site)
    UI.addSite(site)
    Storage.addToLs(this.data)
  }

  validateSite = (name, site) => {
    if (name.trim() == '' || site.trim() == '') {
      return false
    }

    site = site.replace('www.', '')
    site = site.replace('https://', '')
    site = site.replace('http://', '')

    return `http://${site}`
  }

  deleteHandler = e => {
    if (e.target.className === 'site-rm') {
      const id = e.target.parentNode.id
      this.data = this.data.filter(site => id != site.id)
      UI.deleteSite(id)
      Storage.addToLs(this.data)
    }
  }
}

const app = new App()
app.init()
