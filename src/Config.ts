export default class Config {
    private config =  {
        dimming: true,
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


