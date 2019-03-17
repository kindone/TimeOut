import { dialog, ipcRenderer, Menu, remote } from "electron";
import * as $ from "jquery"
import * as moment from "moment";
import * as path from "path";


let origin = moment()

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

const getElapsedTimeFormatted = (from: moment.Moment, to: moment.Moment) => {
    const milliseconds = to.diff(from)

    if (milliseconds <= 0)
      return ""

    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const remainder = milliseconds - hours * (1000 * 60 * 60)
    const minutes = Math.floor(remainder / (1000 * 60))

    if (hours > 0 || minutes > 0) {
      const hourStr = hours > 1 ? " hours " : " hour"
      const minuteStr = minutes > 1 ? " minutes" : " minute"
      return (hours > 0 ? (hours.toString() + hourStr) : "") + (minutes > 0 ? (minutes.toString() + minuteStr) : "")
    } else
      return ""
}


const showTime = () => {
    const now = moment()
    const time = now.format("hh:mm:ss A")
    document.getElementById("ClockDisplay").innerText = time;
    document.getElementById("ClockDisplay").textContent = time;

    let elapsed = ""
    if (now.diff(origin) > 1000 * 60 * 1) { // must be greater than some time to be useful
        // elapsed = now.from(stopWatch, true)
        elapsed = getElapsedTimeFormatted(origin, now)
    }
    document.getElementById("StopWatchDisplay").innerText = elapsed;
    document.getElementById("StopWatchDisplay").textContent = elapsed;
    setTimeout(showTime, 1000);
}

showTime();

const resetStopWatch = () => {
    origin = moment()
}

const startupTray = () => {
    const assetsDirectory = path.join(__dirname, "assets")
    const trayIcon = "timerTemplate.png" // must use *Template.png name to conform with macOS dark theme
    const trayIconPath = path.join(assetsDirectory, trayIcon)
    const tray = new remote.Tray(trayIconPath)

    const trayUpdateInterval = 60 * 1000
    const updateTray = () => {
      const now = moment()
      const elapsed = now.diff(origin)
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

// let alertStr = getElapsedTimeFormatted(moment(), moment().add(44, "minutes")) + ", "
// alertStr += getElapsedTimeFormatted(moment(), moment().add(1, "hours")) + ", "
// alertStr += getElapsedTimeFormatted(moment(), moment().add(1, "minutes")) + ", "
// alertStr += getElapsedTimeFormatted(moment(), moment().add(3, "hours")) + ", "
// alertStr += getElapsedTimeFormatted(moment(), moment().add(2, "hours").add(23, "minutes")) + ", "
// alertStr += getElapsedTimeFormatted(moment(), moment().add(1, "days").add(23, "minutes"))
// alert(alertStr)

ipcRenderer.on("fadeIn", fadeIn)
ipcRenderer.on("fadeOut", fadeOut)
