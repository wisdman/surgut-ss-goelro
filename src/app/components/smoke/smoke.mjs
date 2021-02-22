
import { AbstractComponent } from "../abstract/index.mjs"
import { LIGHTNING_FLASH_EVENT } from "../lightnings/index.mjs"
import { CSS, HTML } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

export class SmokeComponent extends AbstractComponent {
  static TAG_NAME = "ss-smoke"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  #canvas = this.$("canvas");
  #gl = this.#canvas.getContext("webgl")
}
