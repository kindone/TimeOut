




export default class Config {
    public static readonly SCHEDULE_EVERY_3MIN = "SCHEDULE_EVERY_3MIN"
    public static readonly SCHEDULE_EVERY_25MIN = "SCHEDULE_EVERY_25MIN"
    public static readonly SCHEDULE_EVERY_X0 = "SCHEDULE_EVERY_X0"
    public static readonly SCHEDULE_EVERY_00 = "SCHEDULE_EVERY_00"
    public static readonly SCHEDULE_EVERY_00_AND_30 = "SCHEDULE_EVERY_00_AND_30"

    private config =  {
        dimming: true,
        scheduler: Config.SCHEDULE_EVERY_X0,
    }

    constructor() {
        if (this.hasSavedConfig())
            this.config = this.loadConfig()
        else
            this.saveConfig()
    }

    public setBackgroundDimming(value: boolean) {
        this.config.dimming = value
        this.saveConfig()
    }

    public getBackgroundDimming() {
        return this.config.dimming
    }

    public setScheduleEvery3Minutes() {
        this.config.scheduler = Config.SCHEDULE_EVERY_3MIN
        this.saveConfig()
    }

    public setScheduleEvery25Minutes() {
        this.config.scheduler = Config.SCHEDULE_EVERY_25MIN
        this.saveConfig()
    }

    public setScheduleEveryX0() {
        this.config.scheduler = Config.SCHEDULE_EVERY_X0
        this.saveConfig()
    }

    public setScheduleEvery00() {
        this.config.scheduler = Config.SCHEDULE_EVERY_00
        this.saveConfig()
    }

    public setScheduleEvery00And30() {
        this.config.scheduler = Config.SCHEDULE_EVERY_00_AND_30
        this.saveConfig()
    }

    public getSchedule() {
        return this.config.scheduler
    }

    private saveConfig() {
        localStorage.setItem("config", JSON.stringify(this.config))
    }

    private hasSavedConfig() {
        return localStorage.getItem("config")
    }

    private loadConfig() {
        return JSON.parse(localStorage.getItem("config"))
    }
}


