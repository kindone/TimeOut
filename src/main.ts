import { app, BrowserWindow, dialog, Menu, nativeImage, Tray } from "electron";
import * as moment from "moment";
import * as path from "path";


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
  })
  window.loadURL(`file://${path.join(__dirname, "../index.html")}`)
  window.maximize();
  window.setIgnoreMouseEvents(true);
  // window.webContents.openDevTools()
  return window
}


class WindowHandle {
  private window: BrowserWindow

  constructor(isLazy = false) {
    if (!isLazy)
      this.window = createMainWindow()
  }

  public show() {
    this.createIfNeeded()
    this.window.show()
  }

  public hide() {
    this.createIfNeeded()
    this.window.hide()
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

const startupTray = (mainWindow: WindowHandle) => {
  const assetsDirectory = path.join(__dirname, "assets")
  const trayIcon = "clipboardTemplate.png" // must use *Template.png name to conform with macOS dark theme
  const trayIconPath = path.join(assetsDirectory, trayIcon)
  const tray = new Tray(trayIconPath)

  const contextMenu = Menu.buildFromTemplate([
    {label: "About", click() {
      dialog.showMessageBox(
        { message: "Simple Clock and Stop Watch",
          buttons: ["OK"] })
    }},
    {label: "Start Stop Watch", click() {
      mainWindow.show()
    }},
    {label: "Quit", click() {
      app.quit()
    }},
  ])
  tray.setToolTip("Simple Clock and Stop Watch")
  tray.setContextMenu(contextMenu)

}

const startup = () => {
  app.dock.hide()

  const mainWindow = startupMainWindow()
  startupTray(mainWindow)
}


app.on("ready", () => setTimeout(startup, 500));

// // Quit when all windows are closed.
// app.on("window-all-closed", () => {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   // On OS X it"s common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

