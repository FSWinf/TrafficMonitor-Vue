<template>
  <div class="day" :class="{
    'day-important': isDayImportant(day.day),
  }" v-for="day in groupedEvents">
    <h2 class="day-title">{{ formatDay(day.day) }}</h2>
    <div class="event" :class="{
      'event-fs': evt.source === 'FS',
      'event-roomtulearn': evt.source === 'roomTUlearn',
      'event-journaldienste': evt.source === 'Journaldienste',
      'event-active': happeningNow(evt),
    }" v-for="evt in day.events">
      <div class="event-title">
        {{ evt.title }}
      </div>
      <div class="event-time" v-if="evt.fullDay">Ganztägig</div>
      <div class="event-time" v-else>{{ formatTime(evt.start) }} &ndash; {{ formatTime(evt.end) }}</div>
      <div class="event-description" v-if="evt.description">{{ evt.description }}</div>
    </div>
  </div>
</template>

<script>
import ical from "ical";
import { RRuleSet } from "rrule";

function datesSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function nextDayMidnight(date) {
  const ret = new Date(date);
  ret.setDate(ret.getDate() + 1);
  ret.setHours(0);
  ret.setMinutes(0);
  ret.setSeconds(0);
  ret.setMilliseconds(0);
  return ret;
}
const dateFormatter = new Intl.DateTimeFormat("de-AT", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const timeFormatter = new Intl.DateTimeFormat("de-AT", {
  hour: "numeric",
  minute: "numeric",
});
const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;

export default {
  name: 'Calendar',
  data() {
    return {
      now: new Date(),
      fsCalendarData: {},
      seminarraumCalendarData: {},
      journaldiensteCalendarData: {},
      updateCalendarIntervalEvent: Number,
      nowUpdateIntervalEvent: Number,
    };
  },
  methods: {
    async fetchCalendar(url) {
      const resp = await fetch(url);
      const icsText = await resp.text();
      return ical.parseICS(icsText);
    },
    convertCalendarDataToEvents(icsData) {
      const ret = [];
      for (let k in icsData) {
        const ev = icsData[k];
        if (!ev.hasOwnProperty("end")) continue;
        const evStart = new Date(ev.start);
        const evEnd = new Date(ev.end);
        const base = {
          title: ev.summary || "",
          location: ev.location || "",
          description: ev.description || "",
        };
        if (ev.rrule === undefined) {
          if (evEnd < this.now) continue;
          ret.push({
            ...base,
            start: evStart,
            end: evEnd,
            fullDay: ev.start.dateOnly || false,
          });
          continue;
        }

        const rangeStart = new Date(this.now.getTime() - DAY_MILLISECONDS * 1);
        const rangeEnd = new Date(this.now.getTime() + DAY_MILLISECONDS * 21);
        const duration = evEnd - evStart;
        const dates = ev.rrule.between(
          rangeStart,
          rangeEnd,
          true
        );
        if (ev.recurrences !== undefined) {
          for (let r in ev.recurrences) {
            // manual recurrences
            if (new Date(r) > rangeStart && new Date(r) < rangeEnd) {
              dates.push(new Date(r));
            }
          }
        }
        const seen = new Set();
        for (let i in dates) {
          const date = dates[i];
          let curEvt = ev;
          const curDuration = duration;

          if (date.getTimezoneOffset() !== evStart.getTimezoneOffset()) {
            date.setHours(date.getHours() + (date.getTimezoneOffset() - evStart.getTimezoneOffset()) / 60);
          }

          let startDate = new Date(date.getTime());
          const dateLookupKey = date.toISOString().substring(0, 10);
          if (seen.has(dateLookupKey)) {
            continue;
          }
          seen.add(dateLookupKey);

          let endDate = new Date(startDate.getTime() + curDuration);

          if ((curEvt.recurrences !== undefined) && (curEvt.recurrences[dateLookupKey] !== undefined)) {
            curEvt = curEvt.recurrences[dateLookupKey];
            startDate = new Date(curEvt.start);
            endDate = new Date(curEvt.end);
          } else if ((curEvt.exdate !== undefined) && (curEvt.exdate[dateLookupKey] !== undefined)) {
            continue;
          }

          if (endDate < rangeStart || startDate > rangeEnd || endDate < this.now) {
            continue;
          }

          ret.push({
            ...base,
            start: startDate,
            end: endDate,
            fullDay: ev.start.dateOnly || false,
          });
        }
      }
      ret.sort((a, b) => a.start - b.start);
      return ret;
    },
    splitMultiDayEvents(icsEvents) {
      const evts = [];
      for (let ev of icsEvents) {
        const { start, end, fullDay } = ev;
        const sameDay = datesSameDay(start, end);

        // split into multiple events if it spans multiple days
        if (sameDay) {
          evts.push(ev);
          continue;
        }
        let at = start;
        let fullDay2 = fullDay;
        while (at < end) {
          let nextDay = nextDayMidnight(at);
          if (nextDay > end) {
            nextDay = end;
            fullDay2 = fullDay;
          }
          evts.push({
            ...ev,
            start: at,
            end: nextDay,
            fullDay: fullDay2,
          });
          at = nextDay;
          fullDay2 = true;
        }
      }
      evts.sort((a, b) => a.start - b.start);
      return evts;
    },
    formatDay(date) {
      const numDiff = (date - this.now) / DAY_MILLISECONDS;
      let dayNice = dateFormatter.format(date);
      if (numDiff < 0) {
        dayNice = "Heute, " + dayNice;
      } else if (numDiff < 1) {
        dayNice = "Morgen, " + dayNice;
      } else if (numDiff < 2) {
        dayNice = "Übermorgen, " + dayNice;
      }
      return dayNice;
    },
    formatTime(date) {
      return timeFormatter.format(date);
    },
    groupEventsDay(events) {
      const evtsByDay = {};
      for (let evt of events) {
        const day = evt.start.toDateString();
        if (!evtsByDay.hasOwnProperty(day)) {
          evtsByDay[day] = [];
        }
        evtsByDay[day].push(evt);
      }
      // put into sorted array
      const evtsByDayArr = [];
      for (let dayStr in evtsByDay) {
        evtsByDayArr.push({
          day: new Date(dayStr),
          events: evtsByDay[dayStr],
        });
      }
      evtsByDayArr.sort((a, b) => a.day - b.day);
      return evtsByDayArr;
    },
    isDayImportant(date) {
      return (date - this.now) / DAY_MILLISECONDS < 1;
    },
    async updateFSCalendar() {
      this.fsCalendarData = await this.fetchCalendar("/calendar/ical/fachschaft%40winf.at/public/basic.ics");
    },
    async updateSeminarraumCalendar() {
      this.seminarraumCalendarData = await this.fetchCalendar("/events/rest/calendar/room?roomCode=DE0110&locale=de");
    },
    async updateJournaldiensteCalendar() {
      this.journaldiensteCalendarData = await this.fetchCalendar("/calendar/ical/odettgo4tj2tm4ioih85tfr8ag%40group.calendar.google.com/public/basic.ics");
    },
    async updateCalendar() {
      this.now = new Date();
      await Promise.all([
        this.updateFSCalendar(),
        this.updateSeminarraumCalendar(),
        this.updateJournaldiensteCalendar(),
      ]);
    },
    happeningNow(evt) {
      return evt.start < this.now && evt.end > this.now;
    },
  },
  computed: {
    fsCalendarEvents() {
      return this.convertCalendarDataToEvents(this.fsCalendarData)
        .map(ev => ({ ...ev, source: "FS" }));
    },
    seminarraumCalendarEvents() {
      return this.convertCalendarDataToEvents(this.seminarraumCalendarData)
        .filter(ev => ev.title === "roomTUlearn")
        .map(ev => ({ ...ev, source: "roomTUlearn", title: "roomTUlearn Seminarraum DE0110", description: "" }));
    },
    journaldiensteCalendarEvents() {
      const ret = this.convertCalendarDataToEvents(this.journaldiensteCalendarData)
        .slice(0, 2)
        .map(ev => ({ ...ev, source: "Journaldienste", title: `Journaldienst: ${ev.title}` }))
        .filter(/* today */ ev => ev.start.toDateString() === this.now.toDateString());
      if (ret.length === 2 && !this.happeningNow(ret[0])) {
        return [ret[0]];
      }
      return ret;
    },
    groupedEvents() {
      const allEvents = [
        ...this.splitMultiDayEvents(this.fsCalendarEvents),
        ...this.splitMultiDayEvents(this.seminarraumCalendarEvents),
        ...this.splitMultiDayEvents(this.journaldiensteCalendarEvents),
      ].filter((ev) => this.now < ev.end);
      allEvents.sort((a, b) => {
        if (a.start === b.start) return a.end - b.end;
        return a.start - b.start;
      });
      return this.groupEventsDay(allEvents);
    },
  },
  mounted() {
    this.updateCalendar();
    /* every 15 minutes */
    this.updateCalendarIntervalEvent = window.setInterval(this.updateCalendar, 5 * 60_000);
    this.nowUpdateIntervalEvent = window.setInterval(() => {
      this.now = new Date();
    }, 15000);
  },
  beforeUnmount() {
    clearInterval(this.updateCalendarIntervalEvent);
    clearInterval(this.nowUpdateIntervalEvent);
  }
}
</script>

<style>
.bold {
  font-weight: bold;
}

.day {
  margin-bottom: 16pt;
}

.day-title {
  margin-bottom: 4pt;
  margin-top: 0;
}

.event {
  padding: 5pt 8pt;
  /* rounded corners */
  border-radius: 4pt;
  margin-bottom: 6pt;

  --fs-dark: rgb(122, 162, 101);
  --fs-light: rgb(137, 181, 113);
  --roomtulearn-dark: #76a4d6;
  --roomtulearn-light: #8ebdef;
  --journaldienste-dark: #7d7fe1;
  --journaldienste-light: #9192ea;
}

@keyframes slide-stripes {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: -100% 0%;
  }
}

.event-fs {
  border-left: 4pt solid var(--fs-dark);
  background-color: var(--fs-light);
}
.event-fs.event-active {
  background: repeating-linear-gradient(
    45deg, 
    var(--fs-dark), var(--fs-dark) 10pt, 
    var(--fs-light) 10pt, var(--fs-light) 20pt
  );
  background-size: 200% 200%;
  animation: slide-stripes 75s linear infinite;
  /* small white border to highlight it */
  border: 3pt solid white;
}

.event-roomtulearn {
  border-left: 4pt solid var(--roomtulearn-dark);
  background-color: var(--roomtulearn-light);
}
.event-roomtulearn.event-active {
  background: repeating-linear-gradient(
    45deg, 
    var(--roomtulearn-dark), var(--roomtulearn-dark) 10pt, 
    var(--roomtulearn-light) 10pt, var(--roomtulearn-light) 20pt
  );
  background-size: 200% 200%;
  animation: slide-stripes 75s linear infinite;
  border: 3pt solid white;
}

.event-journaldienste {
  border-left: 4pt solid var(--journaldienste-dark);
  background-color: var(--journaldienste-light);
}
.event-journaldienste.event-active {
  background: repeating-linear-gradient(
    45deg, 
    var(--journaldienste-dark), var(--journaldienste-dark) 10pt, 
    var(--journaldienste-light) 10pt, var(--journaldienste-light) 20pt
  );
  background-size: 200% 200%;
  animation: slide-stripes 75s linear infinite;
  border: 3pt solid white;
}

.event-title {
  font-weight: bold;
  font-size: 1.3em;
  margin-bottom: 2pt;
}

.event-time {
  font-size: 1.2em;
  /*font-style: italic;*/
}

.event-description {
  margin-top: 3pt;
  font-size: 0.9em;
}
</style>
