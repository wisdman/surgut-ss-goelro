#!/usr/bin/env node

const { promises:fs } = require("fs")
const path = require("path")

const SRC = path.resolve(__dirname, "src")
const BUILD = path.resolve(__dirname, "build")

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

void async function main() {
  await copy(SRC, BUILD)

  const PACKAGE = require("./package.json")
  delete PACKAGE.scripts
  delete PACKAGE.devDependencies
  PACKAGE.main = "main.js"

  await fs.writeFile(
    path.join(BUILD, "package.json"),
    JSON.stringify(PACKAGE),
    "utf8",
  )
}()