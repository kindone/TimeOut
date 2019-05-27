
import * as Store from "electron-store"

interface ConfigValue {
    dimming: boolean
    scheduler: string
}

export default class Config {
    public static readonly SCHEDULE_EVERY_3MIN = "SCHEDULE_EVERY_3MIN"
    public static readonly SCHEDULE_EVERY_25MIN = "SCHEDULE_EVERY_25MIN"
    public static readonly SCHEDULE_EVERY_X0 = "SCHEDULE_EVERY_X0"
    public static readonly SCHEDULE_EVERY_00 = "SCHEDULE_EVERY_00"
    public static readonly SCHEDULE_EVERY_00_AND_30 = "SCHEDULE_EVERY_00_AND_30"
    public static readonly DEFAULT_VALUE = {
        dimming: true,
        scheduler: Config.SCHEDULE_EVERY_X0,
    }

    private config: ConfigValue
    private store = new Store()

    constructor() {
        this.config = Config.DEFAULT_VALUE

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
        this.store.set("config", this.config)
    }

    private hasSavedConfig(): boolean {
        return this.store.has("config")
    }

    private loadConfig(): ConfigValue {
        return this.store.get("config", Config.DEFAULT_VALUE) as ConfigValue
    }
}


