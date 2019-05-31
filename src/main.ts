import { app,  ipcMain, Menu, powerMonitor, Tray } from "electron";
import * as moment from "moment";
import Config from "./Config";
import { Event } from "./Event";
import { MainWindow } from "./MainWindow";
import { SchedulerFactory } from "./scheduler";
import { Timer } from "./Timer";

const debug = false

const startup = () => {
    const config = new Config()
    const mainWindow = new MainWindow(debug)

    const schedulerNameFromConfig = config.getScheduler()
    const now = moment()
    const timer = new Timer(SchedulerFactory.create(schedulerNameFromConfig, now), () => {
        mainWindow.fadeIn()
    }, () => {
        mainWindow.fadeOut()
    })


    // resume from standby
    powerMonitor.on("resume", () => {
        console.log("resume from standby")
        timer.resumed()
    })

    ipcMain.on(Event.FADEINCOMPLETE, () => {
        console.log(Event.FADEINCOMPLETE)
        timer.fadeInComplete()
    })

    ipcMain.on(Event.FADEOUTCOMPLETE, () => {
        console.log(Event.FADEOUTCOMPLETE)
        mainWindow.hide()
        timer.fadeOutComplete()
    })

    ipcMain.on(Event.SHOW, () => {
        console.log(Event.SHOW)
        timer.showImmediately()
    })

    ipcMain.on(Event.READY, () => {
        console.log(Event.READY)
        timer.showImmediately()
    })

    ipcMain.on(Event.RESCHEDULE, (event: Event, schedulerName: string) => {
        console.log(Event.RESCHEDULE)
        const scheduler = SchedulerFactory.create(schedulerName, moment())
        timer.changeScheduler(scheduler)
        timer.showImmediately()
    })

    ipcMain.on(Event.QUIT, () => {
        mainWindow.close()
        app.quit()
    })

    timer.reinitialize()

}

app.dock.hide()
app.on("ready", () => setTimeout(startup, 500));
