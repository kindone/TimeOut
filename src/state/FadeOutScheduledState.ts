import { BaseTimerState, TimerContext } from ".";
import { FadeOutState } from "./FadeOutState";

export class FadeOutScheduledState extends BaseTimerState {
    constructor(context: TimerContext) {
        super(context)
        console.log(this.toString())
    }

    public toString() {
        return "FadeOutScheduledState"
    }

    public scheduleFadeIn(): void {
        // DO NOTHING
    }

    public fadeIn(): void {
        // DO NOTHING
    }

    public scheduleFadeOut(): void {
        // DO NOTHING
    }

    public fadeOut(): void {
        this.context.changeState(new FadeOutState(this.context))
        this.context.fadeOut()
    }

    public reinitialize() {
        // DO NOTHING
    }

    public showImmediately(): void {
        // DO NOTHING
    }
}
