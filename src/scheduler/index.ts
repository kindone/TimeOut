import moment = require("moment");



export interface Scheduler {
    getNextScheduleInMS(now: moment.Moment): number
}

export { SchedulerForEvery00 } from "./SchedulerForEvery00"
export { SchedulerForEveryX0 } from "./SchedulerForEveryX0"
export { SchedulerForEvery00And30 } from "./SchedulerForEvery00And30"
export { SchedulerForEvery3Minutes } from "./SchedulerForEvery3Minutes"
export { SchedulerForEvery25Minutes } from "./SchedulerForEvery25Minutes"
