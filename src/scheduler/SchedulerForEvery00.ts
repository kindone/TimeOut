import moment = require("moment");
import { Scheduler } from ".";

export class SchedulerForEvery00 implements Scheduler {

    constructor(public initial: moment.Moment) { }

    public getNextScheduleInMS(now: moment.Moment) {
        const next = moment(now)
        .add(1, "hour")
        .startOf("hour")
        .subtract(3, "seconds")

        const timeout = next.diff(now)
        console.log("SchedulerForEvery00", now, next, timeout)

        return timeout >= 0 ? timeout : 0
    }
}
