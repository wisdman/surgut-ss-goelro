
const HREF_RX = /(?<base>.*?)(?<filename>(?<name>[^\/]*?)(?:\.(?<extension>[^\/\.]*))?)$/
const PATH_RH = /(^[\s\/]+|[\s\/]+$)/g

// const CONTENT_PARAM = "content"
// const CONTENT_DEFAULT = "default"
// const CONTENT = (() => {
//   const url = new URLSearchParams(window.location.search)
//   return (url.get(CONTENT_PARAM) ?? CONTENT_DEFAULT).toLowerCase()
// })()

// export const STATE = () => ({ content: CONTENT, ...window.history.state })

export const PARTS = (...parts) => parts.map(p => p.replace(PATH_RH, "")).filter(p => !!p).join("/")

export const TEMPLATE = async (html, object= {}) =>
  (new Function("object", `with(object) return \`${html.replace("`","\\`")}\``))(object)

export const URL = (metaURL, ...parts) => {
  // console.log(metaURL)
  const href = (new window.URL(metaURL)).href
  const {base, extension, filename, name} = HREF_RX.exec(href)?.groups ?? {}
  
  const partsPath = PARTS(...parts)
  if (partsPath) return URL(base + partsPath)
  if (!filename) return URL(base + "index.html")

  return {base, extension, filename, name}
}

export const CSS = async (metaURL, ...parts) => {
  const {base, name} = URL(metaURL, ...parts)
  return `${base}${name}.css`
}

export const HTML = async (metaURL, ...parts) => {
  const {base, name} = URL(metaURL, ...parts)
  const href = `${base}${name}.html`
  const response = await fetch(href)
  const html = await response.text()
  return TEMPLATE(html, {base})
}

// export const CONTENT = (metaURL, ...parts) => {
//   const { name = "default" } = URL(metaURL)
//   const partsPath = PARTS(...parts)
//   return `${CONTENT_TEMPLATE_PATH}/${CONTENT_DIR}/${partsPath}/${name}.html`
// }
