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

const getElasedTimeInHoursAndMinutes = (from: moment.Moment, to: moment.Moment) => {
  const milliseconds = to.diff(from)

  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const remainder = milliseconds - hours * (1000 * 60 * 60)
  const minutes = Math.floor(remainder / (1000 * 60))

  return [hours, minutes]
}

const getElapsedTimeFormatted = (from: moment.Moment, to: moment.Moment) => {
    const [hours, minutes] = getElasedTimeInHoursAndMinutes(from, to)

    if (hours > 0 || minutes > 0) {
      const hourStr = hours > 1 ? " hours " : " hour"
      const minuteStr = minutes > 1 ? " minutes" : " minute"
      return (hours > 0 ? (hours.toString() + hourStr) : "") + (minutes > 0 ? (minutes.toString() + minuteStr) : "")
    } else
      return ""
}

const getElapsedTimeShort = (from: moment.Moment, to: moment.Moment) => {
  const [hours, minutes] = getElasedTimeInHoursAndMinutes(from, to)

  if (hours > 0 || minutes > 0) {
    return (hours > 0 ? (hours.toString() + "h ") : "") + (minutes > 0 ? (minutes.toString() + "min") : "")
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
      tray.setTitle(getElapsedTimeShort(origin, now))
    }
    updateTray()
    setInterval(updateTray, trayUpdateInterval)

    const contextMenu = remote.Menu.buildFromTemplate([
      {label: "About", click() {
        remote.dialog.showMessageBox(
          { message: "Simple Clock and Elapsed Timer",
            buttons: ["OK"] })
      }},
      {label: "Reset elapsed time", click() {
        resetStopWatch()
        updateTray()
      }},
      {label: "Quit", click() {
        ipcRenderer.send("quit")
      }},
    ])
    tray.setToolTip("Simple Clock and Elapsed Timer")
    tray.setContextMenu(contextMenu)
}

startupTray()

$(".wrapper").hide()
fadeIn()

ipcRenderer.on("fadeIn", fadeIn)
ipcRenderer.on("fadeOut", fadeOut)
