import { AbstractComponent } from "../abstract/index.mjs"
import { CSS } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)

const DATASET_ROUTE = "route"
const DATASET_TITLE = "title"
// const DATASET_BASE = "base"

const END_SPASH_RX = /\/+$/
// const START_SPASH_RX = /^\/+/

export const ROUTE_EVENT = "Route"

const HASH_RX = /#+?(?<value>.*)/

export class RouterComponent extends AbstractComponent {
  static TAG_NAME = "ss-router"

  static STYLES = STYLE

  #routes = {}
  #backBtn = document.createElement("button")

  get current() {
    const { pathname } = window.location
    return pathname
  }

  connectedCallback() {
    super.connectedCallback()

    // fill routes database
    this.#routes = Array.from(this.children)
                        .filter(node => node instanceof HTMLTemplateElement
                                    && typeof node.dataset[DATASET_ROUTE] === "string"
                               )
                        .reduce((acc, node) => {
                          const route = this.#getPathname(node.dataset[DATASET_ROUTE])
                          const title = node.dataset[DATASET_TITLE] ?? route
                          const content = node.content
                          const isDark = node.hasAttribute("dark")
                          return {...acc, [route]: {title, content, isDark} }
                        },{})
    
    this.#backBtn.classList.add("back-btn")
    this.#backBtn.addEventListener("click", this.#clickBack)
    
    this.route()
  }

  #getPathname = (path = "") => {
    path = path.trim().replace(END_SPASH_RX, "")
    const { origin, href, pathname } = window.location

    if (path.length === 0) {
      return pathname
    }
    
    if (path[0] === '/') {
      const { pathname } = new URL(`${origin}${path}`)
      return pathname
    }

    {
      const { pathname } = new URL(`${href}/${path}`)
      return pathname
    }
  }

  route = (path = this.#getPathname()) => {
    const { title, content, isDark } = this.#routes[path] ?? {}
    if (!content) return false
    
    this.reset()
    this.root.appendChild(content.cloneNode(true))
    console.log(window.location.pathname, this.backPath)
    if (path !== this.backPath) this.root.appendChild(this.#backBtn)
    document.title = title

    if (isDark) this.#backBtn.classList.add("dark")
    else this.#backBtn.classList.remove("dark")

    history.replaceState({}, title, path)
    return true
  }

  [`on${ROUTE_EVENT}`] = (event) => {
    const { detail = {} } = event
    const { route } = detail

    if (!route) return

    const currentPath = this.#getPathname()
    const newPath = this.#getPathname(route)

    if (currentPath === newPath) return
    if (this.route(newPath)) event.stopPropagation() 
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.#backBtn.removeEventListener("click", this.#clickBack)
  }

  get backPath () {
    const current = this.#getPathname(window.location.pathname)
    return current.replace(/(\/.*)\/[^\/]*$/, "$1")
  }

  #clickBack = event => {
    event.stopPropagation()
    event.preventDefault()

    const { hash } = window.location
    const value =  HASH_RX.exec(hash)?.groups?.value ?? ""
    if (!value) {
      this.route(this.backPath)
      return
    }
    window.location.hash = ""
  }
}
