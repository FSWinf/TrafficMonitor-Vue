<template>
  <div class="main">
    <div id="top-bar">
      <div id="top-bar-row-container">
        <Clock />
      </div>
      <hr>
    </div>
    <TransitSignage />
  </div>
</template>

<script>
import Clock from "./components/Clock.vue";
import TransitSignage from "./components/TransitSignage.vue";

export default {
  name: 'App',
  components: {
    Clock,
    TransitSignage
  },
  data() {
    return {
      dateNow: new Date(),
      updateTimeIntervalEvent: Number,
    }
  },
  computed: {
    transitTime() {
      /*return this.dateNow.getHours() >= 20 || this.dateNow.getHours() < 7;*/
      return true;
    },
  },
  methods: {
    updateTime() {
      this.dateNow = new Date();
    },
  },
  mounted() {
    this.updateTimeIntervalEvent = window.setInterval(this.updateTime, 10000);
  },
  beforeUnmounted() {
    clearInterval(this.updateTimeIntervalEvent);
  }
}
</script>

<style>
body {
  margin: 0;
  height: 100%;
}
#app {
  height: calc(100% - (80pt));

  padding: calc(var(--text-font-size) * 1.5);
}
:root {
  /* disable scrolling */
  margin: 0;
  height: 100%;
  /*overflow: hidden;*/
}

.main {
  height: 100%;
}

#top-bar hr {
  margin-bottom: 0;
}

#top-bar-row-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
