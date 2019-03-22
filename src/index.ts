import { app, BrowserWindow, dialog, ipcMain, Menu, powerMonitor, screen, Tray } from "electron";
import * as moment from "moment";
import * as path from "path";

const debug = false
const showDuration = debug ? 6000 : 4000

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

  screen.on("display-metrics-changed", () => {
    window.maximize()
  })

  return window
}


class MainWindow {
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
  }

  public hide() {
    this.createIfNeeded()
    this.window.hide()
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
  return new MainWindow()
}

const getNextSchedule = (now: moment.Moment): number =>  {
  const next10Minutes = moment(now)
    .set("minutes", now.minute() - (now.minute() % 10))
    .add(9, "minutes")
    .startOf("minute")
    .add(57, "seconds")

  const timeout = next10Minutes.diff(now)
  console.log(now, next10Minutes, timeout)

  if (timeout >= 0)
    return timeout
  else
    return getNextSchedule(now.add(10, "minutes"))
}

const startup = () => {

  const mainWindow = startupMainWindow()
  // startupTray(mainWindow)

  let timeout: NodeJS.Timeout = null

  const hideAndScheduleShow = () => {
    if (timeout != null)
      clearTimeout(timeout)
    timeout = setTimeout(showAndScheduleHide, getNextSchedule(moment()))
    mainWindow.fadeOut()
  }

  const showAndScheduleHide = () => {
    if (timeout != null)
      clearTimeout(timeout)

    timeout = setTimeout(hideAndScheduleShow, showDuration)
    mainWindow.fadeIn()
  }

  showAndScheduleHide()

  // bug: resume from standby
  powerMonitor.on("resume", () => {
    console.log("resume from standby")
    hideAndScheduleShow()
  })

  ipcMain.on("quit", () => {
    mainWindow.close()
    app.quit()
  })

  ipcMain.on("hide", () => {
    mainWindow.hide()
  })

  ipcMain.on("show", () => {
    showAndScheduleHide()
  })
}

app.dock.hide()
app.on("ready", () => setTimeout(startup, 500));
