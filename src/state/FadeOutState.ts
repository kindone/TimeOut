import { BaseTimerState, TimerContext } from ".";
import { FadeInScheduledState } from "./FadeInScheduledState";


export class FadeOutState extends BaseTimerState {
    constructor(context: TimerContext) {
        super(context)
        console.log(this.toString())
    }

    public toString() {
        return "FadeOutState"
    }

    public scheduleFadeIn(): void {
        this.context.changeState(new FadeInScheduledState(this.context))
        this.context.scheduleFadeIn()
    }

    public fadeIn(): void {
        // DO NOTHING
    }

    public scheduleFadeOut(): void {
        // DO NOTHING
    }

    public fadeOut(): void {
        // DO NOTHING
    }

    public reinitialize() {
        // DO NOTHING
    }

    public showImmediately(): void {
        // DO NOTHING
    }
}
