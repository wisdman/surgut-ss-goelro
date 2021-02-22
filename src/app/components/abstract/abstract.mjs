// import { STATE } from "../utils.mjs"

const TAG = "TAG_NAME"

const STYLES = "STYLES"
const STYLES_SYMBOL = Symbol(STYLES)

const TEMPLATE = "TEMPLATE"
const TEMPLATE_SYMBOL = Symbol(TEMPLATE)

const HTML = "HTML"
const HTML_SYMBOL = Symbol(HTML)

const DEFINE = "INIT"
const DEFINE_SYMBOL = Symbol(DEFINE)

export class AbstractComponent extends HTMLElement {
  static [TAG] = undefined

  static get [STYLES_SYMBOL]() {
    return [
      ...(Object.getPrototypeOf(this)[STYLES_SYMBOL] ?? []),
      ...(this.hasOwnProperty(STYLES) ? [this[STYLES]].flat() : [])
    ]
  }

  static get [TEMPLATE_SYMBOL]() {
    return this.hasOwnProperty(TEMPLATE) ? this[TEMPLATE] : ""
  }

  static get [HTML_SYMBOL]() {
    return this[STYLES_SYMBOL].map(s => `<link rel="stylesheet" type="text/css" href="${s}">`).join("")
         + this[TEMPLATE_SYMBOL]
  }

  static [DEFINE_SYMBOL]() {
    if (!this.hasOwnProperty(TAG) || typeof this[TAG] !== "string") return
    customElements.define(this[TAG], this)
  }

  // #eventsBus = new EventsBus(this)

  #root = this.attachShadow({ mode: "open" })
  get root() { return this.#root }

  $ = (selector, { root = true, host = true } = {}) => {
    return root && this.root.querySelector(selector) ||
           host && this.querySelector(selector)
  }

  $$ = (selector, { root = true, host = true } = {}) => {
    return [
      ...(root ? this.root.querySelectorAll(selector) : []),
      ...(host ? this.querySelectorAll(selector) : []),
    ]
  }

  // #stateClasses = (state = STATE()) => {
  //   for (const [key, value] of Object.entries(state)) {
  //     this.classList.add(`state__${key}--${value}`)
  //   }
  // }

  constructor() {
    super()
    this.reset()
    // this.#stateClasses()
  }

  reset = () => {
    this.#root.innerHTML = Object.getPrototypeOf(this).constructor[HTML_SYMBOL]
  }

  emit(eventName, detail = {}, {
    bubbles = false,
    composed = false,
  } = {}) {
    eventName = eventName.toLowerCase()
    const event = new CustomEvent(eventName, { detail, bubbles, composed })
    this.dispatchEvent(event)
  }

  get events() {
    const ON_FN_RX = /^on(?<eventName>.+)/i
    return Object.getOwnPropertyNames(this)
                 .map(fnName => ON_FN_RX.exec(fnName)?.groups?.eventName)
                 .filter(eventName => eventName && this[`on${eventName}`] instanceof Function)
  }

  connectedCallback() {
    this.events.forEach(eventName => {
      this.addEventListener(eventName.toLowerCase(), this[`on${eventName}`])
    }
    )
  }

  disconnectedCallback() {
    this.events.forEach(eventName =>
      this.removeEventListener(eventName.toLowerCase(), this[`on${eventName}`])
    )
  }
}

export async function InitComponents(components) {
  for (const component of Object.values(components)) {
    if (component[DEFINE_SYMBOL]) component[DEFINE_SYMBOL]()
  }
}