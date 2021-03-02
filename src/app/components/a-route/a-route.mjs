
import { AbstractComponent } from "../abstract/index.mjs"
import { ROUTE_EVENT } from "../router/index.mjs"
import { CSS } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)

export class ARouteComponent extends AbstractComponent {
  static TAG_NAME = "ss-a-route"
  
  static STYLES = STYLE

  onClick = event => {
    event.preventDefault()
    event.stopPropagation()
    const route = this.getAttribute("href")
    this.emit(ROUTE_EVENT, { route }, { bubbles: true, composed: true })
  }
}
