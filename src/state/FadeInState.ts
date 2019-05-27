import { BaseTimerState, TimerContext } from ".";
import { FadeOutScheduledState } from "./FadeOutScheduledState";

export class FadeInState extends BaseTimerState {
    constructor(context: TimerContext) {
        super(context)
        console.log(this.toString())
    }

    public toString() {
        return "FadeInState"
    }

    public scheduleFadeIn(): void {
        this.throwUndefined()
    }

    public fadeIn(): void {
        // DO nothing
    }

    public scheduleFadeOut(): void {
        this.context.changeState(new FadeOutScheduledState(this.context))
        this.context.scheduleFadeOut()
    }

    public fadeOut(): void {
        this.throwUndefined()
    }

    public reinitialize() {
        // DO nothing
    }

    public showImmediately(): void {
        // DO nothing
    }
}
