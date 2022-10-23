<template>
  <div class="time">{{ timeString }}</div>
</template>

<script>
export default {
  name: "Clock",
  data() {
    return {
      dateNow: new Date(),
      updateTimeIntervalEvent: Number,
    }
  },
  computed: {
    timeString: function () {
      return this.dateNow.toLocaleTimeString('de-AT', {timeStyle: "short"});
    }
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

<style scoped>
div.time {
  font-size: var(--clock-font-size);
  text-align: right;

  font-variant: tabular-nums;
}
</style>
