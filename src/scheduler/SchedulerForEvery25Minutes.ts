import moment = require("moment");
import { Scheduler } from ".";

export class SchedulerForEvery25Minutes implements Scheduler {

    constructor(public initial: moment.Moment) { }

    public getNextScheduleInMS(now: moment.Moment) {
        const next = moment(now).add(25, "minutes").subtract(3, "seconds")
        const timeout = next.diff(now)
        console.log("SchedulerForEvery25Minutes", now, next, timeout)

        return timeout >= 0 ? timeout : 0
    }
}
