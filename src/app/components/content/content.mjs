
import { AbstractComponent } from "../abstract/index.mjs"
import { CSS, HTML } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)

const DATASET_HTML = "html"
const DATASET_CSS = "css"

export class ContentComponent extends AbstractComponent {
  static TAG_NAME = "ss-content"
  
  static STYLES = STYLE

  get html() {
    return this.dataset[DATASET_HTML] ?? ""
  }

  get css() {
    return this.dataset[DATASET_CSS] ?? ""
  }

  constructor() {
    super()
    this.#loadTemplate(this.css, this.html)
  }

  #loadTemplate = async (css, html) => {
    // css = css ? `<link rel="stylesheet" type="text/css" href="${this.css}">` : ""
    const { origin } = window.location
    html = await HTML(`${origin}${html}`)
    const template = document.createElement("template")
    template.innerHTML = html
    this.parentNode.replaceChild(template.content.cloneNode(true), this)
  }
}
