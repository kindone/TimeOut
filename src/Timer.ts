import moment = require("moment");
import { Scheduler, SchedulerForEveryX0 } from "./scheduler";
import { TimerContext, TimerState } from "./state";
import { InitialTimerState } from "./state/InitialTimerState";


export class Timer implements TimerContext {
    private scheduler: Scheduler
    private timeout: NodeJS.Timeout = null
    private timerState: TimerState = new InitialTimerState(this)

    constructor(scheduler: Scheduler = new SchedulerForEveryX0(moment()),
                readonly fadeInCallback: () => void,
                readonly fadeOutCallback: () => void) {
        this.scheduler = scheduler
    }

    public scheduleFadeIn(): void {
        if (this.timeout)
            clearTimeout(this.timeout)

        const now = moment()
        const nextSchedule = this.scheduler.getNextScheduleInMS(now)
        this.timeout = setTimeout(() => {
            this.timerState.fadeIn()
        }, nextSchedule)
    }

    public fadeIn(): void {
        this.fadeInCallback()
    }

    public fadeInComplete(): void {
        this.timerState.scheduleFadeOut()
    }

    public scheduleFadeOut(): void {
        if (this.timeout)
            clearTimeout(this.timeout)

        const now = moment()
        const next = moment(now).add(3, "seconds").diff(now)

        this.timeout = setTimeout(() => {
            this.timerState.fadeOut()
        }, next)
    }

    public fadeOut(): void {
        this.fadeOutCallback()
    }

    public fadeOutComplete(): void {
        this.timerState.scheduleFadeIn()
    }

    public reinitialize(): void {
        this.cancelTimeout()
        this.timerState.scheduleFadeIn()
    }

    public resumed(): void {        
        this.timerState.reinitialize()
    }

    public showImmediately(): void {
        this.timerState.fadeIn()
    }

    public cancelTimeout(): void {
        if (this.timeout)
            clearTimeout(this.timeout)
        this.timeout = null
    }

    public getScheduler(): Scheduler {
        return this.scheduler
    }

    public changeScheduler(scheduler: Scheduler): void {
        this.scheduler = scheduler
        this.timerState.reinitialize()
    }

    public changeState(newState: TimerState): void {
        this.timerState = newState
    }
}
