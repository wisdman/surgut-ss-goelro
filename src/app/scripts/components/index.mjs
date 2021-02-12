export { AbstractComponent } from "./abstract/index.mjs"
export * from "./main-page/index.mjs"

import { InitComponents } from "./abstract/index.mjs"
import * as COMPONENTS from "./index.mjs"

InitComponents(COMPONENTS)