import moment = require("moment");
import { Scheduler } from ".";

export class SchedulerForEvery00And30 implements Scheduler {

    constructor(public initial: moment.Moment) { }

    public getNextScheduleInMS(now: moment.Moment) {
        const next = moment(now)
        .set("minutes", now.minute() - (now.minute() % 10))
        .add(10, "minutes")
        .startOf("minute")
        .subtract(3, "seconds")

        const timeout = next.diff(now)
        console.log(now, next, timeout)

        return timeout >= 0 ? timeout : 0
    }
}
