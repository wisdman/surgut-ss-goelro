
import { AbstractComponent } from "../abstract/index.mjs"
import { CSS, HTML } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

export class TimeRibbonComponent extends AbstractComponent {
  static TAG_NAME = "ss-time-ribbon"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE
}
