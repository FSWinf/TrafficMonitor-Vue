<template>
  <div class="day" :class="{
    'day-important': isDayImportant(day.day),
  }" v-for="day in groupedEvents">
    <h2 class="day-title">{{ formatDay(day.day) }}</h2>
    <div class="event" :class="{
      'event-fs': evt.source === 'FS',
      'event-roomtulearn': evt.source === 'roomTUlearn',
      'event-journaldienste': evt.source === 'Journaldienste',
    }" v-for="evt in day.events">
      <div class="event-title">
        <span v-if="happeningNow(evt)">🔴 </span>
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
        const rangeEnd = new Date(this.now.getTime() + DAY_MILLISECONDS * 7);
        const duration = evEnd - evStart;
        const dates = ev.rrule.between(
          rangeStart,
          rangeEnd,
          true
        );
        if (ev.recurrences !== undefined) {
          for (let r in ev.recurrences) {
            if (new Date(r) > rangeStart && new Date(r) < rangeEnd) {
              dates.push(new Date(r));
            }
          }
        }
        for (let i in dates) {
          const date = dates[i];
          let curEvt = ev;
          const curDuration = duration;

          let startDate = new Date(date.getTime());
          const dateLookupKey = date.toISOString().substring(0, 10);

          if ((curEvt.recurrences !== undefined) && (curEvt.recurrences[dateLookupKey] !== undefined)) {
            curEvt = curEvt.recurrences[dateLookupKey];
            startDate = new Date(curEvt.start);
          } else if ((curEvt.exdate !== undefined) && (curEvt.exdate[dateLookupKey] !== undefined)) {
            continue;
          }

          const endDate = new Date(startDate.getTime() + curDuration);

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
      return this.convertCalendarDataToEvents(this.journaldiensteCalendarData)
        .slice(0, 2)
        .map(ev => ({ ...ev, source: "Journaldienste", title: `Journaldienst: ${ev.title}` }));
    },
    groupedEvents() {
      const allEvents = [
        ...this.splitMultiDayEvents(this.fsCalendarEvents),
        ...this.splitMultiDayEvents(this.seminarraumCalendarEvents),
        ...this.splitMultiDayEvents(this.journaldiensteCalendarEvents),
      ];
      allEvents.sort((a, b) => a.start - b.start);
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
}

.event-fs {
  background-color: rgb(100, 142, 77);
}
.event-roomtulearn {
  background-color: #006699;
}
.event-journaldienste {
  background-color: #b69e3c;
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
