import { BaseTimerState, TimerContext } from ".";
import { Scheduler } from "../scheduler";
import { FadeInState } from "./FadeInState";
import { FadeOutScheduledState } from "./FadeOutScheduledState";
import { InitialTimerState } from "./InitialTimerState";


export class FadeInScheduledState extends BaseTimerState {

    constructor(context: TimerContext) {
        super(context)
        console.log(this.toString())
    }

    public toString() {
        return "FadeInScheduledState"
    }

    public scheduleFadeIn(): void {
        this.throwUndefined()
    }

    public fadeIn(): void {
        this.changeState(new FadeInState(this.context))
        this.context.fadeIn()
    }

    public scheduleFadeOut(): void {
        this.throwUndefined()
    }

    public fadeOut(): void {
        this.throwUndefined()
    }

    public reinitialize() {
        this.changeState(new InitialTimerState(this.context))
        this.context.reinitialize()
    }

    public showImmediately(): void {
        this.fadeIn()
    }

    public changeScheduler(scheduler: Scheduler): void {
        super.changeScheduler(scheduler)
        this.reinitialize()
    }


}
