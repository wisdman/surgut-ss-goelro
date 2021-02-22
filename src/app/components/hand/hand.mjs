
import { AbstractComponent } from "../abstract/index.mjs"
import { CSS, HTML } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

const CLASS_SHOW = "ss-hand--show"
const SHOW_TIMEOUT = 20

export class HandComponent extends AbstractComponent {
  static TAG_NAME = "ss-hand"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  #now = () => Number(new Date())

  #lastCheck = this.#now()
  #interval = undefined

  connectedCallback() {
    window.addEventListener("pointerdown", this.#pointerdown, { passive: true })

    this.#lastCheck = this.#now()
    this.#interval = setInterval(this.#onInterval, SHOW_TIMEOUT * 500)
  }

  disconnectedCallback() {
    window.removeEventListener("pointerdown", this.#pointerdown)
    if (this.#interval) clearInterval(this.#interval)
  }

  #pointerdown = () => {
    this.#lastCheck = this.#now()
    this.classList.remove(CLASS_SHOW)
  }

  #onInterval = () => {
    const lastCheck = this.#lastCheck
    const currentTime = this.#now()
    const delta = Math.ceil((currentTime-lastCheck) / 1000)
    if (delta > SHOW_TIMEOUT) requestAnimationFrame(() => this.classList.add(CLASS_SHOW))
  }
}
