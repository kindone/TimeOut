import { BrowserWindow, screen } from "electron";
import * as path from "path";
import { Event } from "./Event";


const createMainWindow = (debug = false) => {
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
        show: true,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    window.on("show", () => {
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

export class MainWindow {
    private window: BrowserWindow

    constructor(debug = false) {
        this.window = createMainWindow(debug)
    }

    public fadeIn() {
        this.createIfNeeded()
        this.window.showInactive() // prevent having focus
        this.window.webContents.send(Event.FADEIN)
    }

    public fadeOut() {
        this.createIfNeeded()
        this.window.webContents.send(Event.FADEOUT)
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
