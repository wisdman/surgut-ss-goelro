
import { AbstractComponent } from "../abstract/index.mjs"
import { CSS, HTML } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

const DATASET_SECTION = "section"

const HASH_RX = /#+?(?<value>.*)/

const CLASS_IS_ACTIVE = "is-active"

// console.log(JSON.stringify(window.location))

export class SectionComponent extends AbstractComponent {
  static TAG_NAME = "ss-section"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  get section() {
    return this.dataset[DATASET_SECTION] ?? 0
  }

  #scrollable = undefined

  connectedCallback() {
    const section = this.section
    const template = this.$(`#section-${this.section}`, { host: false })
    this.classList.add("main")
    this.root.appendChild(template.content.cloneNode(true))
    window.addEventListener("hashchange", this.#onHashChange, { capture: true })

    this.#scrollable = this.$("[scrollable]", { host: false })
    if (this.#scrollable) this.#scrollable.addEventListener("scroll", this.#onScroll, { passive: true })
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.#onHashChange, { capture: true })
    if (this.#scrollable) this.#scrollable.removeEventListener("scroll", this.#onScroll)
    this.reset()
  }

  #onScroll = (event) => {
    const scrollTop = this.#scrollable.scrollTop
    requestAnimationFrame(() => this.style.setProperty("--scroll-top", scrollTop))
  }

  #onHashChange = (event) => {
    const { hash } = window.location
    const value =  HASH_RX.exec(hash)?.groups?.value ?? "main"
    requestAnimationFrame(() => {
      this.className = value
      for (const node of this.children) {
        if (node.id === value) node.classList.add(CLASS_IS_ACTIVE)
        else node.classList.remove(CLASS_IS_ACTIVE)
      }
    })
  }
}
