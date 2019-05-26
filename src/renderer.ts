import { ipcRenderer, remote } from "electron";
import * as $ from "jquery"
import * as moment from "moment";
import * as path from "path";
import Config from "./Config"

let origin = moment()
const config = new Config()

const fadeIn = () => {
  $(".wrapper").fadeIn("slow", () => {
    console.log("fadeInComplete")
    ipcRenderer.send("fadeInComplete")
  })
}

const fadeOut = () => {
  $(".wrapper").fadeOut("slow", () => {
    console.log("fadeOutComplete")
    ipcRenderer.send("fadeOutComplete")
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
      const hourStr = hours > 1 ? " hours " : " hour "
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

    const elapsed = getElapsedTimeFormatted(origin, now)

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

    tray.setToolTip("TimeOut: Simple Clock and Elapsed Timer")

    const setContextMenu = (dimming: boolean) => {
      const dimmingLabel = "Turn " + (dimming ? "off" : "on") + " background dimming"

      const contextMenu = remote.Menu.buildFromTemplate([
        {label: "About TimeOut", click() {
          remote.dialog.showMessageBox(
            { message: "Simple Clock and Elapsed Timer",
              buttons: ["OK"] })
        }},
        {label: "Display the clock now", click() {
          ipcRenderer.send("show")
        }},
        {label: "Display the clock ...", submenu: [
          {label: "Every 3 minutes", click() {
            config.setScheduleEvery3Minutes()
            ipcRenderer.send("reschedule", Config.SCHEDULE_EVERY_3MIN)
          }},
          {label: "Every 25 minutes", click() {
            config.setScheduleEvery25Minutes()
            ipcRenderer.send("reschedule", Config.SCHEDULE_EVERY_25MIN)
          }},
          {label: "Every 10th minute", click() {
            config.setScheduleEveryX0()
            ipcRenderer.send("reschedule", Config.SCHEDULE_EVERY_X0)
          }},
          {label: "Every 30th minute", click() {
            config.setScheduleEvery00And30()
            ipcRenderer.send("reschedule", Config.SCHEDULE_EVERY_00_AND_30)
          }},
          {label: "Every hour on the hour", click() {
            config.setScheduleEvery00()
            ipcRenderer.send("reschedule", Config.SCHEDULE_EVERY_00)
          }},
        ]},
        // {label: "Display Elapsed time", },
        {label: dimmingLabel, click() {
          if (dimming)
            $(".background").hide()
          else
            $(".background").show()

          config.setBackgroundDimming(!dimming)
          setContextMenu(!dimming)
        }},
        {label: "Reset elapsed time", click() {
          resetStopWatch()
          updateTray()
        }},
        {label: "Quit", click() {
          ipcRenderer.send("quit")
        }},
      ])

      tray.setContextMenu(contextMenu)
    }

    setContextMenu(config.getBackgroundDimming())
}

startupTray()

$(".wrapper").hide()
// fadeIn()

ipcRenderer.on("fadeIn", fadeIn)
ipcRenderer.on("fadeOut", fadeOut)
