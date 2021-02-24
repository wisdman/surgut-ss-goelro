const { parentPort, workerData } = require("worker_threads")

const path = require("path")

const LocalWebServer = require("local-web-server")
const ws = LocalWebServer.create({
  port: workerData,
  directory: path.join(__dirname, "app"),
  spa: "index.html",
})

parentPort.on("message", ({command} = {}) => {
  switch (command) {
    case "close":
      ws.server.close()
      return
  }
})

parentPort.postMessage({ success: true })
