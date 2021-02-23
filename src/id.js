const path = require("path")

const DEFAULT_ID = 0

const CONFIG = (() => {
  const { dir, name } = path.parse(process.argv[0])
  const cfgPath = path.resolve(dir, name + ".json")

  try {
    return require(cfgPath)
  } catch (err) {
    console.error(err)
    return undefined
  }
})()

module.exports = CONFIG?.id ?? DEFAULT_ID