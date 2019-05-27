import * as moment from "moment";

export class TimeFormatter {

    public static getElasedTimeInHoursAndMinutes(from: moment.Moment, to: moment.Moment) {
        const milliseconds = to.diff(from)

        const hours = Math.floor(milliseconds / (1000 * 60 * 60))
        const remainder = milliseconds - hours * (1000 * 60 * 60)
        const minutes = Math.floor(remainder / (1000 * 60))

        return [hours, minutes]
    }

    public static getElapsedTimeFormatted(from: moment.Moment, to: moment.Moment) {
        const [hours, minutes] = this.getElasedTimeInHoursAndMinutes(from, to)

        if (hours > 0 || minutes > 0) {
            const hourStr = hours > 1 ? " hours " : " hour "
            const minuteStr = minutes > 1 ? " minutes" : " minute"
            return (hours > 0 ? (hours.toString() + hourStr) : "") +
             (minutes > 0 ? (minutes.toString() + minuteStr) : "")
        } else
            return ""
    }

    public static getElapsedTimeShort(from: moment.Moment, to: moment.Moment) {
        const [hours, minutes] = this.getElasedTimeInHoursAndMinutes(from, to)

        if (hours > 0 || minutes > 0) {
            return (hours > 0 ? (hours.toString() + "h ") : "") + (minutes > 0 ? (minutes.toString() + "min") : "")
        } else
            return ""
    }
}
