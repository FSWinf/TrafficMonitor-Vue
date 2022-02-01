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
      return this.dateNow.toLocaleTimeString('de-AT');
    }
  },
  methods: {
    updateTime() {
      this.dateNow = new Date();
    },
  },
  mounted() {
    this.updateTimeIntervalEvent = window.setInterval(this.updateTime, 500);
  },
  beforeUnmounted() {
    clearInterval(this.updateTimeIntervalEvent);
  }
}
</script>

<style scoped>
div.time {
  font-size: 42pt;
  text-align: right;

  font-variant: tabular-nums;
}
</style>
