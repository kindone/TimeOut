import { BaseTimerState, TimerContext } from ".";
import { FadeInScheduledState } from "./FadeInScheduledState";
import { FadeInState } from "./FadeInState";



export class InitialTimerState extends BaseTimerState {
    constructor(context: TimerContext) {
        super(context)
        console.log(this.toString())
    }

    public toString() {
        return "InitialState"
    }

    public scheduleFadeIn(): void {
        this.context.scheduleFadeIn()
        this.context.changeState(new FadeInScheduledState(this.context))
    }

    public fadeIn(): void {
        this.context.changeState(new FadeInState(this.context))
        this.context.fadeIn()
    }

    public scheduleFadeOut(): void {
        this.throwUndefined()
    }

    public fadeOut(): void {
        this.throwUndefined()
    }

    public reinitialize(): void {
        // DO nothing
    }

    public showImmediately(): void {
        this.fadeIn()
    }

}
