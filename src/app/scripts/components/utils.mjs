
const HREF_RX = /(?<base>.*?)(?<filename>(?<name>[^\/]*?)(?:\.(?<extension>[^\/\.]*))?)$/
const PATH_RH = /(^[\s\/]+|[\s\/]+$)/g

export const URL = (metaURL, ...parts) => {
  const href = (new window.URL(metaURL)).href
  const {base, extension, filename, name} = HREF_RX.exec(href)?.groups ?? {}
  
  const partsPath = parts.map(p => p.replace(PATH_RH, "")).filter(p => !!p).join("/")
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
  return response.text()
}
