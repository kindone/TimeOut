import { ipcRenderer, remote, Tray } from "electron";
import * as $ from "jquery"
import * as path from "path";
import Config from "./Config";
import { Event } from "./Event";


const config = new Config()

const remoteConsole = remote.getGlobal("console")

export const startupTray = (resetCallback: () => void): Tray => {
    const assetsDirectory = path.join(__dirname, "assets")
    const trayIcon = "timerTemplate.png" // must use *Template.png name to conform with macOS dark theme
    const trayIconPath = path.join(assetsDirectory, trayIcon)
    const tray = new remote.Tray(trayIconPath)

    tray.setToolTip("TimeOut: Simple Clock and Elapsed Timer")

    const setContextMenu = (dimming: boolean) => {
        remoteConsole.log("dimming:", dimming)
        const dimmingLabel = "Turn " + (dimming ? "off" : "on") + " background dimming"

        const contextMenu = remote.Menu.buildFromTemplate([
            {label: "About TimeOut", click() {
                remote.dialog.showMessageBox(
                    { message: "Simple Clock and Elapsed Timer",
                    buttons: ["OK"] })
            }},
            {label: "Display the clock now", click() {
                ipcRenderer.send(Event.SHOW)
            }},
            {label: "Display the clock ...", submenu: [
                {label: "Every 3 minutes", click() {
                    config.setScheduleEvery3Minutes()
                    ipcRenderer.send(Event.RESCHEDULE, Config.SCHEDULE_EVERY_3MIN)
                }},
                {label: "Every 25 minutes", click() {
                    config.setScheduleEvery25Minutes()
                    ipcRenderer.send(Event.RESCHEDULE, Config.SCHEDULE_EVERY_25MIN)
                }},
                {label: "Every 10th minute", click() {
                    config.setScheduleEveryX0()
                    ipcRenderer.send(Event.RESCHEDULE, Config.SCHEDULE_EVERY_X0)
                }},
                {label: "Every 30th minute", click() {
                    config.setScheduleEvery00And30()
                    ipcRenderer.send(Event.RESCHEDULE, Config.SCHEDULE_EVERY_00_AND_30)
                }},
                {label: "Every hour on the hour", click() {
                    config.setScheduleEvery00()
                    ipcRenderer.send(Event.RESCHEDULE, Config.SCHEDULE_EVERY_00)
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
                resetCallback()
            }},
            {label: "Quit", click() {
                ipcRenderer.send("quit")
            }},
        ])

        tray.setContextMenu(contextMenu)
    }

    setContextMenu(config.getBackgroundDimming())

    return tray
}
