const electronPackager = require("electron-packager")

const { promises:fs } = require("fs")
const path = require("path")

const SRC = path.resolve(__dirname, "src")
const BUILD = path.resolve(__dirname, "build")

const PACKAGE = require("./package.json")

async function copy(src, dst) {
  const stat = await fs.stat(src)
  if (stat.isDirectory()) {
    try {
      await fs.mkdir(dst)
    } catch (err) {
      if (err.code !== "EEXIST") throw err
    }

    const files = await fs.readdir(src)
    for await (const file of files) {
      await copy(path.join(src, file), path.join(dst, file))
    }
    return
  }

  await fs.copyFile(src, dst)
}

async function package_json() {
  const dst = path.join(BUILD, "package.json")
  const json = require("./package.json")
  delete json.scripts
  delete json.devDependencies
  json.main = "main.js"
  await fs.writeFile(dst,JSON.stringify(json),"utf8")
}

async function build_electron() {
  try {
    await electronPackager({
      name: PACKAGE.name,
      dir: "src",
      out: "build",
      version: PACKAGE.version,
      platform: "darwin",
      arch: "x64"
    })
  } catch  (err) {
    console.error(err)
  }
}

void async function main() {
  // await copy(SRC, BUILD)
  // await package_json()
  await build_electron()
}()