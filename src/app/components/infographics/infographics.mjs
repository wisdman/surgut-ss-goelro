
import { AbstractComponent } from "../abstract/index.mjs"
import { CSS, HTML, URL } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

export class InfographicsComponent extends AbstractComponent {
  static TAG_NAME = "ss-infographics"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  connectedCallback() {
    super.connectedCallback()
    const dataUrl = URL(window.location.origin, this.dataset.json)
    this.#updateContent(dataUrl)
  }

  #updateContent = async ({base, filename}) => {
    const data = await (await fetch(`${base}${filename}`)).json()
  }
}