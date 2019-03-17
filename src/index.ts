import { app, BrowserWindow, dialog, ipcMain, Menu, Tray } from "electron";
import * as moment from "moment";
import * as path from "path";

const debug = false

const createMainWindow = () => {
  // create browser window hidden
  console.log("WINDOW CREATED")
  const window = new BrowserWindow({
    height: 600,
    width: 800,
    transparent: true,
    title: "Simple Clock and Stop Watch",
    alwaysOnTop: true,
    frame: false,
    closable: false,
    focusable: false,
    show: false,
    // type: "desktop",
  })
  window.on("show", () => {
    console.log("ready-to-show")
    window.blur()
    window.blurWebView()
  })
  window.loadURL(`file://${path.join(__dirname, "assets/index.html")}`)
  window.maximize();
  if (debug) {
    window.webContents.openDevTools()
  } else {
    window.setIgnoreMouseEvents(true);
  }

  return window
}


class WindowHandle {
  private window: BrowserWindow

  constructor(isLazy = false) {
    if (!isLazy)
      this.window = createMainWindow()
  }

  public fadeIn() {
    this.createIfNeeded()
    this.window.showInactive() // prevent having focus
    this.window.webContents.send("fadeIn")
  }

  public fadeOut() {
    this.createIfNeeded()
    this.window.webContents.send("fadeOut")
    console.log("fadeOut")
  }

  public hide() {
    this.createIfNeeded()
    this.window.hide()
    console.log("hide")
  }

  public close() {
    if (this.window !== undefined && !this.window.isDestroyed()) {
      this.window.destroy() // close() doesn't seem to work with closable=false
    }
  }

  private createIfNeeded() {
    if (this.window === undefined || this.window.isDestroyed()) {
      this.window = createMainWindow()
      this.window.on("closed", () => {
        this.window = undefined
      })
    }
  }

}

const startupMainWindow = () => {
  return new WindowHandle()
}

const getNextSchedule = (): number =>  {
  const now = moment()
  const nextHour = moment(now).startOf("hour").add(1, "hours")
  const next10Minutes = moment(now)
    .set("minutes", now.minute() - (now.minute() % 10)).add(10, "minutes").startOf("minute")

  const next = nextHour.isBefore(next10Minutes) ? nextHour : next10Minutes
  const timeout = next.diff(now)
  console.log(now, nextHour, next10Minutes, next, timeout)

  return timeout
}

const startup = () => {
  const showDuration = debug ? 6000 : 3000

  const mainWindow = startupMainWindow()
  // startupTray(mainWindow)

  const hideAndScheduleShow = () => {
    mainWindow.fadeOut()
    setTimeout(showAndScheduleHide, getNextSchedule())
  }

  const showAndScheduleHide = () => {
    mainWindow.fadeIn()
    setTimeout(hideAndScheduleShow, showDuration)
  }

  showAndScheduleHide()

  ipcMain.on("quit", () => {
    mainWindow.close()
    app.quit()
  })

  ipcMain.on("hide", () => {
    mainWindow.hide()
  })
}

app.dock.hide()
app.on("ready", () => setTimeout(startup, 500));
