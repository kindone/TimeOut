import { app,  ipcMain, Menu, powerMonitor, Tray } from "electron";
import * as moment from "moment";
import Config from "./Config";
import { Event } from "./Event";
import { MainWindow } from "./MainWindow";
import { SchedulerForEvery00,
    SchedulerForEvery00And30,
    SchedulerForEvery25Minutes,
    SchedulerForEvery3Minutes,
    SchedulerForEveryX0,
} from "./scheduler";
import { Timer } from "./Timer";

const debug = false

const startup = () => {
    const mainWindow = new MainWindow(debug)

    const now = moment()
    const timer = new Timer(new SchedulerForEveryX0(now), () => {
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

    ipcMain.on(Event.RESCHEDULE, (event: Event, scheduleOption: string) => {
        console.log(Event.RESCHEDULE)
        switch (scheduleOption) {
            case Config.SCHEDULE_EVERY_3MIN:
                return timer.changeScheduler(new SchedulerForEvery3Minutes(moment()))
            case Config.SCHEDULE_EVERY_25MIN:
                return timer.changeScheduler(new SchedulerForEvery25Minutes(moment()))
            case Config.SCHEDULE_EVERY_X0:
                return timer.changeScheduler(new SchedulerForEveryX0(moment()))
            case Config.SCHEDULE_EVERY_00_AND_30:
                return timer.changeScheduler(new SchedulerForEvery00And30(moment()))
            case Config.SCHEDULE_EVERY_00:
                return timer.changeScheduler(new SchedulerForEvery00(moment()))
            default:
                throw new Error("unknown schedule option: " + scheduleOption)
        }
    })

    ipcMain.on(Event.QUIT, () => {
        mainWindow.close()
        app.quit()
    })

    timer.reinitialize()    

}

app.dock.hide()
app.on("ready", () => setTimeout(startup, 500));
