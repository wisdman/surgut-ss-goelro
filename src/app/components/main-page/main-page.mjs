
import { AbstractComponent } from "../abstract/index.mjs"
import { LIGHTNING_FLASH_EVENT } from "../lightnings/index.mjs"
import { CSS, HTML } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

export class MainPageComponent extends AbstractComponent {
  static TAG_NAME = "ss-main-page"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  #brandSelector = this.$(".brands");
  [`on${LIGHTNING_FLASH_EVENT}`] = () => this.#brandSelector?.horor()
}