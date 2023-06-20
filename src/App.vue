<template>
  <div>
    <div id="top-bar">
      <div id="top-bar-row-container">
        <img src="@/assets/fswinf-logo-wob.svg" class="fswinf-logo">
        <Clock />
      </div>
      <hr>
    </div>
    <div id="info-display-winf">
      <div class="signage-left">
        <TransitSignage />
      </div>
      <div class="signage-right">
        <Calendar />
      </div>
    </div>
    <Announcements />
  </div>
</template>

<script>
import Clock from "./components/Clock.vue";
import TransitSignage from "./components/TransitSignage.vue";
import Calendar from "./components/Calendar.vue";
import Announcements from "./components/Announcements.vue";

export default {
  name: 'App',
  components: {
    Clock,
    TransitSignage,
    Calendar,
    Announcements,
  },
}
</script>

<style>
:root {
  padding: 12pt 32pt;
  /* disable scrolling */
  margin: 0;
  padding-top: 24pt;
  height: 100%;
  overflow: hidden;
}

#top-bar hr {
  margin-bottom: 0;
}

#top-bar-row-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fswinf-logo {
  height: 2.2em;
  color: inherit;
}

#info-display-winf {
  display: flex;
  height: 100%;
}

.signage-left {
  flex: 1;
  padding-right: 12pt;
  /* small white border on right */
  border-right: 1px solid white;
}

.signage-right {
  flex: 1;
  padding: 0 12pt;
}

.signage-left, .signage-right {
  padding-top: 12pt;
}
</style>
