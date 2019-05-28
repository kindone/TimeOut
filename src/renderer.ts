import { ipcRenderer } from "electron";
import * as $ from "jquery"
import * as moment from "moment";
import { Event } from "./Event";
import { TimeFormatter } from "./TimeFormatter";
import { startupTray } from "./Tray";

const trayUpdateInterval = 60 * 1000
let origin = moment()

const resetStopWatch = () => {
  origin = moment()
}


const fadeIn = () => {
    $(".wrapper").fadeIn("slow", () => {
        console.log(Event.FADEINCOMPLETE)
        ipcRenderer.send(Event.FADEINCOMPLETE)
    })
}

const fadeOut = () => {
    $(".wrapper").fadeOut("slow", () => {
        console.log(Event.FADEOUTCOMPLETE)
        ipcRenderer.send(Event.FADEOUTCOMPLETE)
    })
}


const showTime = () => {
    const now = moment()
    const time = now.format("hh:mm:ss A")
    document.getElementById("ClockDisplay").innerText = time;
    document.getElementById("ClockDisplay").textContent = time;

    const elapsed = TimeFormatter.getElapsedTimeFormatted(origin, now)

    document.getElementById("StopWatchDisplay").innerText = elapsed;
    document.getElementById("StopWatchDisplay").textContent = elapsed;
    setTimeout(showTime, 1000);
}

showTime();

const resetStopWatchCallback = () => {
  resetStopWatch()
  updateTray()
}

const tray = startupTray(resetStopWatchCallback)

const updateTray = () => {
    const now = moment()
    tray.setTitle(TimeFormatter.getElapsedTimeShort(origin, now))
}

updateTray()
setInterval(updateTray, trayUpdateInterval)

$(".wrapper").hide()

ipcRenderer.on(Event.FADEIN, fadeIn)
ipcRenderer.on(Event.FADEOUT, fadeOut)

ipcRenderer.send(Event.READY)
