<template>
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1" />
  <div class="announcement" :class="{
    active: activeNotification !== null,
  }">
    <div v-if="activeNotification !== null">
      <h1>{{ activeNotification.title }}</h1>
      <AnnouncementContainer :content="activeNotification.description" />
      <img src="@/assets/fswinf-logo.svg" class="logo">
    </div>
  </div>
</template>

<script>
import ical from "ical";
import AnnouncementContainer from "./AnnouncementContainer.vue";

export default {
  name: 'Announcements',
  components: {
    AnnouncementContainer,
  },
  data() {
    return {
      now: new Date(),
      notificationsCalendarEvents: [],
      updateCalendarIntervalEvent: Number,
      nowUpdateIntervalEvent: Number,
      done: false,
    };
  },
  methods: {
    async fetchCalendar(url) {
      const resp = await fetch(url);
      const icsText = await resp.text();
      const icsData = ical.parseICS(icsText);
      const ret = [];
      for (let k in icsData) {
        const ev = icsData[k];
        if (!ev.hasOwnProperty("end")) continue;
        const evStart = new Date(ev.start);
        const evEnd = new Date(ev.end);
        if (evEnd < this.now) continue;
        ret.push({
          title: ev.summary || "",
          start: evStart,
          end: evEnd,
          fullDay: ev.start.dateOnly || false,
          location: ev.location || "",
          description: ev.description || "",
        });
      }
      ret.sort((a, b) => a.start - b.start);
      return ret;
    },
    async updateCalendar() {
      this.now = new Date();
      this.notificationsCalendarEvents = await this.fetchCalendar("/calendar/ical/23cb4a35701161fd3793c0fcb5d1da52a04cb8f53b23b6f25bcb1077a584ab06%40group.calendar.google.com/public/basic.ics");
    },
    purify(html) {
      // return DOMPurify.sanitize(html);
      return html
    },
  },
  computed: {
    activeNotification() {
      for (const evt of this.notificationsCalendarEvents) {
        if (evt.start < this.now && evt.end > this.now) {
          return evt;
        } 
      }
      return null;
    },
  },
  mounted() {
    this.updateCalendar();
    /* every 5 minutes */
    this.updateCalendarIntervalEvent = window.setInterval(this.updateCalendar, 5 * 60_000);
    this.nowUpdateIntervalEvent = window.setInterval(() => {
      this.now = new Date();
    }, 15000);
  },
  beforeUnmount() {
    clearInterval(this.updateCalendarIntervalEvent);
    clearInterval(this.nowUpdateIntervalEvent);
    this.done = true;
  },
}
</script>

<style>
.announcement {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  visibility: hidden;
}

.announcement.active {
  visibility: visible;
  color: black;
  /* center text vertically and horizontally */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 3em;
}

.announcement h1 {
  margin-top: 0;
  margin-bottom: 12pt;
  font-family: "Bitter", sans-serif;
}

.logo {
  position: fixed;
  bottom: 0;
  right: 0;
  height: 1.5em;
  margin: 0.5em 0.75em;
}</style>
