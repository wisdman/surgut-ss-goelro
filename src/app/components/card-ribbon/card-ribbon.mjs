import { AbstractComponent } from "../abstract/index.mjs"
import { CSS, HTML } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

export class CardRibbonComponent extends AbstractComponent {
  static TAG_NAME = "ss-card-ribbon"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  onScroll = () => {
    requestAnimationFrame(() => this.style.setProperty("--scroll-top", this.scrollTop))
  }
}