import { ipcRenderer } from "electron";
import * as $ from "jquery"
import * as moment from "moment";
import * as Snap from "snapsvg"
import { Event } from "./Event";
import { TimeFormatter } from "./TimeFormatter";
import { startupTray } from "./Tray";


const trayUpdateInterval = 60 * 1000
let origin = moment()

const resetStopWatch = () => {
  origin = moment()
}


function initClock() {
    const s = Snap(document.getElementById("clock") as unknown as SVGElement)

    const seconds = s.select("#seconds")
    const minutes = s.select("#minutes")
    const hours   = s.select("#hours")
    const rim     = s.select("#rim")
    const face    = {
        elem: s.select("#face"),
        cx: s.select("#face").getBBox().cx,
        cy: s.select("#face").getBBox().cy,
    }
    const easing = (a: number) => {
        if (a === 0 || a === 1)
            return a
        return Math.pow(4, -10 * a) * Math.sin((a - .075) * 2 * Math.PI / .3) + 1
    };

    const sshadow = seconds.clone()
    const mshadow = minutes.clone()
    const hshadow = hours.clone()
    const rshadow = rim.clone()
    const shadows = [sshadow, mshadow, hshadow]

    // Insert shadows before their respective opaque pals
    seconds.before(sshadow);
    minutes.before(mshadow);
    hours.before(hshadow);
    rim.before(rshadow);

    // Create a filter to make a blurry black version of a thing
    const filter = Snap.filter.blur(0.1) + Snap.filter.brightness(0);

    // dd the filter, shift and opacity to each of the shadows
    shadows.forEach((el) => {
        el.attr({
            transform: "translate(0, 2)",
            opacity: 0.2,
            filter: s.filter(filter),
        });
    })

    rshadow.attr({
        transform: "translate(0, 8) ",
        opacity: 0.5,
        filter: s.filter(Snap.filter.blur(0, 8) + Snap.filter.brightness(0)),
    })

    function update() {
        const time = new Date();
        setHours(time);
        setMinutes(time);
        setSeconds(time);
    }

    function setHours(t: Date) {
        let hour = t.getHours()
        hour %= 12
        hour += Math.floor(t.getMinutes() / 10) / 6
        const angle = hour * 360 / 12
        hours.animate(
            {transform: "rotate(" + angle + " 244 251)"},
            100,
            mina.linear,
            () => {
                if (angle === 360) {
                hours.attr({transform: "rotate(" + 0 + " " + face.cx + " " + face.cy + ")"});
                hshadow.attr({transform: "translate(0, 2) rotate(" + 0 + " " + face.cx + " " + face.cy + 2 + ")"})
                }
            },
        );
        hshadow.animate(
            {transform: "translate(0, 2) rotate(" + angle + " " + face.cx + " " + face.cy + 2 + ")"},
            100,
            mina.linear,
        )
    }

    function setMinutes(t: Date) {
        let minute = t.getMinutes();
        minute %= 60;
        minute += Math.floor(t.getSeconds() / 10) / 6
        const angle = minute * 360 / 60;
        minutes.animate({
            transform: "rotate(" + angle + " " + face.cx + " " + face.cy + ")"},
            100,
            mina.linear,
            () => {
                if (angle === 360) {
                    minutes.attr({transform: "rotate(" + 0 + " " + face.cx + " " + face.cy + ")"})
                    mshadow.attr({transform: "translate(0, 2) rotate(" + 0 + " " + face.cx + " " + face.cy + 2 + ")"})
                }
            },
        )
        mshadow.animate({transform: "translate(0, 2) rotate(" + angle + " " + face.cx + " " + face.cy + 2 + ")"},
            100,
            mina.linear,
        )
    }

    function setSeconds(t: Date) {
        let sec = t.getSeconds();
        sec %= 60;
        let angle = sec * 360 /  60;
        // if ticking over to 0 seconds, animate angle to 360 and then switch angle to 0
        if (angle === 0) angle = 360;
        seconds.animate({
            transform: "rotate(" + angle + " " + face.cx + " " + face.cy + ")"},
            600,
            easing,
            () => {
                if (angle === 360) {
                    seconds.attr({transform: "rotate(" + 0 + " " + face.cx + " " + face.cy + ")"});
                    sshadow.attr({transform: "translate(0, 2) rotate(" + 0 + " " + face.cx + " " + face.cy + 2 + ")"})
                }
            },
        )
        sshadow.animate({
            transform: "translate(0, 2) rotate(" + angle  + " " + face.cx + " " + face.cy + 2 + ")"},
            600,
            easing,
        );
    }
    update()
    setInterval(update, 1000);
}

const fadeIn = () => {
    $(".wrapper").fadeIn("fast", () => {
        $("#clock").fadeIn("fast", () => {
            console.log(Event.FADEINCOMPLETE)
            ipcRenderer.send(Event.FADEINCOMPLETE)
        })
    })
}

const fadeOut = () => {
    $("#clock").fadeOut("slow", () => {
        $(".wrapper").fadeOut("slow", () => {
            console.log(Event.FADEOUTCOMPLETE)
            ipcRenderer.send(Event.FADEOUTCOMPLETE)
        })
    })
}


const showTime = () => {
    const now = moment()
    const time = now.format("hh:mm:ss A")
    document.getElementById("ClockDisplay").innerText = time;
    document.getElementById("ClockDisplay").textContent = time;

    const elapsed = TimeFormatter.getElapsedTimeFormatted(origin, now)

    document.getElementById("StopWatchDisplay").innerText = elapsed;
    document.getElementById("StopWatchDisplay").textContent = elapsed;
    setTimeout(showTime, 1000);
}

// showTime();
initClock()

const resetStopWatchCallback = () => {
  resetStopWatch()
  updateTray()
}

const tray = startupTray(resetStopWatchCallback)

const updateTray = () => {
    const now = moment()
    tray.setTitle(TimeFormatter.getElapsedTimeShort(origin, now))
}

updateTray()
setInterval(updateTray, trayUpdateInterval)

$("#clock").hide()
$(".wrapper").hide()

ipcRenderer.on(Event.FADEIN, fadeIn)
ipcRenderer.on(Event.FADEOUT, fadeOut)

ipcRenderer.send(Event.READY)
