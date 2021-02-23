const { app, BrowserWindow, powerSaveBlocker, globalShortcut, dialog, screen } = require("electron")

const ID = require("./id.js")
const WINDOW_OPTIONS = require("./window-options.js")

const SS_URL = `http://localhost:8000/ss-${ID}`

const REMOTE_DEBUGGING_PORT = 8080

// Suppress error dialogs by overriding
dialog.showErrorBox = (title, content) => console.error(`${title}\n${content}`)

const powerSaveID = powerSaveBlocker.start("prevent-display-sleep")

app.commandLine.appendSwitch("disable-renderer-backgrounding")
app.commandLine.appendSwitch("enable-accelerated-video")
app.commandLine.appendSwitch("enable-gpu-rasterization")
app.commandLine.appendSwitch("enable-native-gpu-memory-buffers")
app.commandLine.appendSwitch("enable-zero-copy")
app.commandLine.appendSwitch("force-device-scale-factor", "1")
app.commandLine.appendSwitch("high-dpi-support", "1")
app.commandLine.appendSwitch("ignore-certificate-errors")
app.commandLine.appendSwitch("ignore-connections-limit", `localhost`)
app.commandLine.appendSwitch("ignore-gpu-blacklist")
app.commandLine.appendSwitch("no-proxy-server")
app.commandLine.appendSwitch("remote-debugging-port", String(REMOTE_DEBUGGING_PORT))

app.on("ready", main)
app.on("window-all-closed", exit)

let windows = []

function exit() {
  windows.forEach(w => w.close())
  powerSaveBlocker.stop(powerSaveID)
  app.exit()
}

function reload() {
  windows.forEach(w => w.webContents.reloadIgnoringCache())
} 

function urls() {
  windows.forEach(w => w.loadURL("chrome://chrome-urls/"))
}

function getDisplays() {
  return screen.getAllDisplays()
               .sort(({bounds: {x: a}}, {bounds: {x: b}}) => a - b)
               .map(({bounds}, i) => ({...bounds, id: i + 1 }))
}


async function initViewPorts() {
  for (const { id, x, y, width, height } of getDisplays()) {

    let win = new BrowserWindow({
      ...WINDOW_OPTIONS,
      x: x + width / 4,
      y: y + height / 4,
      width: width / 2,
      height: height / 2,
    })

    win.on("closed", () => {
      windows = windows.filter(w => w !== win)
      win = null
    })

    win.removeMenu()
    
    win.loadURL(SS_URL)
    win.show()
    
    windows.push(win)
  }
}

async function initGlobalShortcut() {
  globalShortcut.register("CommandOrControl+G", gpu)
  globalShortcut.register("CommandOrControl+Q", exit)
  globalShortcut.register("F5", reload)
}

async function main() {
  await initViewPorts()
  await initGlobalShortcut()
}
