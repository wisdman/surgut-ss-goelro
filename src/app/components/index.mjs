export { AbstractComponent } from "./abstract/index.mjs"
export * from "./brand-selector/index.mjs"
export * from "./content/index.mjs"
export * from "./hand/index.mjs"
export * from "./lightnings/index.mjs"
export * from "./main-page/index.mjs"
export * from "./router/index.mjs"
export * from "./section/index.mjs"
export * from "./smoke/index.mjs"
export * from "./time-ribbon/index.mjs"

import { InitComponents } from "./abstract/index.mjs"
import * as COMPONENTS from "./index.mjs"

await InitComponents(COMPONENTS)