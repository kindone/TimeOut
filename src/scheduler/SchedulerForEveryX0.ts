import moment = require("moment");
import { Scheduler } from ".";

export class SchedulerForEveryX0 implements Scheduler {

    constructor(public initial: moment.Moment) { }

    public getNextScheduleInMS(now: moment.Moment) {
        const next = moment(now)
        .set("minutes", now.minute() - (now.minute() % 10))
        .add(9, "minutes")
        .startOf("minute")
        .add(57, "seconds")

        const timeout = next.diff(now)
        console.log("SchedulerForEveryX0", now, next, timeout)

        return timeout >= 0 ? timeout : 0
    }
}
