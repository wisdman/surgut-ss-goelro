
import { AbstractComponent } from "../abstract/index.mjs"
import { CSS, HTML } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

const ACTIVE_CLASS="active"
const MIN_TIMEOUT = 3000
const MAX_TIMEOUT = 5000

export const LIGHTNING_FLASH_EVENT = "LightningFlash"

export class LightningsComponent extends AbstractComponent {
  static TAG_NAME = "ss-lightnings"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  static GetTimeout = () => Math.round(Math.random() * (MAX_TIMEOUT - MIN_TIMEOUT) + MIN_TIMEOUT)

  #videos = this.$$("video", { host: false })

  #timeout = () => new Promise(resolve => setTimeout(resolve, LightningsComponent.GetTimeout()))

  #stop = () => {
    requestAnimationFrame(() => {
      this.#videos.forEach(node => {
        node.classList.remove(ACTIVE_CLASS)
        node.currentTime = 0
      })
    })
  }

  #flash = () => {
    const id = Math.floor(Math.random() * this.#videos.length)
    const videoNode = this.#videos[id]
    requestAnimationFrame(() => {
      videoNode.classList.add(ACTIVE_CLASS)
      videoNode.play()
    })
    this.emit(LIGHTNING_FLASH_EVENT, {}, { bubbles: true, composed: true })
  }

  #render = async () => {
    this.#stop()
    await this.#timeout()
    this.#flash()
  } 

  connectedCallback() {
    this.#videos.forEach(videoNode =>{
      videoNode.addEventListener("ended", this.#render, { passive: true })
      videoNode.addEventListener("error", this.#render, { passive: true })
    })
    this.#render()
  }

  disconnectedCallback() {
    this.#videos.forEach(videoNode =>{
      videoNode.removeEventListener("ended", this.#render)
      videoNode.removeEventListener("error", this.#render)
    })
  }
}
