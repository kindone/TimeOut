import moment = require("moment");
import { Scheduler } from ".";

export class SchedulerForEvery3Minutes implements Scheduler {

    constructor(public initial: moment.Moment) { }

    public getNextScheduleInMS(now: moment.Moment) {
        const next = moment(now).add(2, "minutes").add(57, "seconds")
        const timeout = next.diff(now)
        // console.log("SchedulerForEvery3Minutes", now, next, timeout)

        return timeout >= 0 ? timeout : 0
    }
}
