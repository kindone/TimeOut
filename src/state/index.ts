import { Scheduler } from "../scheduler";

interface TimerActions {
    scheduleFadeIn(): void
    scheduleFadeOut(): void
    fadeIn(): void
    fadeOut(): void
    reinitialize(): void
    showImmediately(): void
    changeScheduler(scheduler: Scheduler): void

    changeState(newState: TimerState): void
}

export interface TimerContext extends TimerActions {
    getScheduler(): Scheduler
    cancelTimeout(): void
}

export interface TimerState extends TimerActions {
    getContext(): TimerContext
}

export abstract class BaseTimerState implements TimerState {
    constructor(readonly context: TimerContext) {}

    public getContext(): TimerContext {
        return this.context
    }

    public abstract scheduleFadeIn(): void

    public abstract fadeIn(): void

    public abstract scheduleFadeOut(): void

    public abstract fadeOut(): void

    public abstract reinitialize(): void

    public abstract showImmediately(): void

    public changeScheduler(scheduler: Scheduler): void {
        this.context.changeScheduler(scheduler)
    }

    public changeState(newState: TimerState) {
        this.context.changeState(newState)
    }

    protected throwUndefined() {
        throw new Error("undefined state transition")
    }
}
