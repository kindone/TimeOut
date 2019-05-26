import { app, BrowserWindow, dialog, ipcMain, Menu, powerMonitor, screen, Tray } from "electron";
import * as moment from "moment";
import * as path from "path";
import Config from "./Config";
import { SchedulerForEvery00,
    SchedulerForEvery00And30,
    SchedulerForEvery25Minutes,
    SchedulerForEvery3Minutes,
    SchedulerForEveryX0,
} from "./scheduler";
import { Timer } from "./Timer";

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

const startup = () => {
    const mainWindow = startupMainWindow()
    const now = moment()
    const timer = new Timer(new SchedulerForEveryX0(now), () => {
        mainWindow.fadeIn()
    }, () => {
        mainWindow.fadeOut()
    })

    timer.reinitialize()

    // resume from standby
    powerMonitor.on("resume", () => {
        console.log("resume from standby")
        timer.reinitialize()
    })

    ipcMain.on("quit", () => {
        mainWindow.close()
        app.quit()
    })

    ipcMain.on("fadeInComplete", () => {
        console.log("fadeInComplete")
        timer.fadeInCompete()
    })

    ipcMain.on("fadeOutComplete", () => {
        console.log("fadeOutComplete")
        mainWindow.hide()
        timer.fadeOutComplete()
    })

    ipcMain.on("show", () => {
        console.log("showImmediately")
        timer.showImmediately()
    })

    ipcMain.on("reschedule", (event: Event, scheduleOption: string) => {
        console.log("showImmediately")
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
}

app.dock.hide()
app.on("ready", () => setTimeout(startup, 500));
