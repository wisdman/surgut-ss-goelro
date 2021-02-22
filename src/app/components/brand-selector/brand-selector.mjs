
import { AbstractComponent } from "../abstract/index.mjs"
import { ROUTE_EVENT } from "../router/index.mjs"
import { CSS, HTML } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

export class BrandSelectorComponent extends AbstractComponent {
  static TAG_NAME = "ss-brand-selector"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  #brands = this.$$(".brand")
                .map(node => {
                  node.classList.add("brand--on")
                  node.addEventListener("click", () => this.#onBrandClick(node))
                  return node
                })

  #onBrandClick = node => {
    const { route } = node.dataset
    if (!route) return
    this.emit(ROUTE_EVENT, { route }, { bubbles: true, composed: true })
  }

  horor = () => {
    const id = Math.floor(Math.random() * this.#brands.length)
    requestAnimationFrame(() => {
      this.#brands.forEach(node => node.classList.remove("brand--flash"))
      this.#brands[id].classList.add("brand--flash")
    })
    
  }
}
