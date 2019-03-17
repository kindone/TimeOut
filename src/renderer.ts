import { dialog, ipcRenderer, Menu, remote } from "electron";
import * as $ from "jquery"
import * as moment from "moment";
import * as path from "path";


let stopWatch = moment()

const fadeIn = () => {
  console.log("fadeIn")
  $(".wrapper").fadeIn("fast")
}

const fadeOut = () => {
  console.log("fadeOut")
  $(".wrapper").fadeOut("slow", () => {
    console.log("hide")
    ipcRenderer.send("hide")
  })
}

const getElapsedTimeFormatted = (from: moment.Moment, now: moment.Moment) => {
    const milliseconds = now.diff(from)
    const normalized = Math.floor(milliseconds / (1000 * 60)) * 1000 * 60 // by minutes
}


const showTime = () => {
    const now = moment()
    const time = now.format("hh:mm:ss A")
    document.getElementById("ClockDisplay").innerText = time;
    document.getElementById("ClockDisplay").textContent = time;

    let elapsed = ""
    if (now.diff(stopWatch) > 1000 * 60 * 1) { // must be greater than some time to be useful
        elapsed = now.from(stopWatch, true)
    }
    document.getElementById("StopWatchDisplay").innerText = elapsed;
    document.getElementById("StopWatchDisplay").textContent = elapsed;
    setTimeout(showTime, 1000);
}

showTime();

const resetStopWatch = () => {
    stopWatch = moment()
}

const startupTray = () => {
    const assetsDirectory = path.join(__dirname, "assets")
    const trayIcon = "timerTemplate.png" // must use *Template.png name to conform with macOS dark theme
    const trayIconPath = path.join(assetsDirectory, trayIcon)
    const tray = new remote.Tray(trayIconPath)

    const trayUpdateInterval = 60 * 1000
    const updateTray = () => {
      const now = moment()
      const elapsed = now.diff(stopWatch)
      tray.setTitle(moment.duration(elapsed, "milliseconds").humanize())
    }
    updateTray()
    setInterval(updateTray, trayUpdateInterval)

    const contextMenu = remote.Menu.buildFromTemplate([
      {label: "About", click() {
        remote.dialog.showMessageBox(
          { message: "Simple Clock and Stop Watch",
            buttons: ["OK"] })
      }},
      {label: "Reset Stop Watch", click() {
        resetStopWatch()
        updateTray()
      }},
      {label: "Quit", click() {
        // remote.app.quit()
        // alert("quit")
        ipcRenderer.send("quit")
      }},
    ])
    tray.setToolTip("Simple Clock and Stop Watch")
    tray.setContextMenu(contextMenu)
}

startupTray()

$(".wrapper").hide()
fadeIn()

ipcRenderer.on("fadeIn", fadeIn)
ipcRenderer.on("fadeOut", fadeOut)
