import * as moment from "moment";
import Config from "../Config";
import { SchedulerForEvery00 } from "./SchedulerForEvery00"
import { SchedulerForEvery00And30 } from "./SchedulerForEvery00And30"
import { SchedulerForEvery25Minutes } from "./SchedulerForEvery25Minutes"
import { SchedulerForEvery3Minutes } from "./SchedulerForEvery3Minutes"
import { SchedulerForEveryX0 } from "./SchedulerForEveryX0"

export interface Scheduler {
    getNextScheduleInMS(now: moment.Moment): number
}

export class SchedulerFactory {
    public static create(scheduleOption: string, now: moment.Moment) {
        switch (scheduleOption) {
            case Config.SCHEDULE_EVERY_3MIN:
                return new SchedulerForEvery3Minutes(now)
            case Config.SCHEDULE_EVERY_25MIN:
                return new SchedulerForEvery25Minutes(now)
            case Config.SCHEDULE_EVERY_X0:
                return new SchedulerForEveryX0(now)
            case Config.SCHEDULE_EVERY_00_AND_30:
                return new SchedulerForEvery00And30(now)
            case Config.SCHEDULE_EVERY_00:
                return new SchedulerForEvery00(now)
            default:
                throw new Error("unknown schedule option: " + scheduleOption)
        }
    }
}

export { SchedulerForEvery00 } from "./SchedulerForEvery00"
export { SchedulerForEveryX0 } from "./SchedulerForEveryX0"
export { SchedulerForEvery00And30 } from "./SchedulerForEvery00And30"
export { SchedulerForEvery3Minutes } from "./SchedulerForEvery3Minutes"
export { SchedulerForEvery25Minutes } from "./SchedulerForEvery25Minutes"
