<template>
  <h2 class="stop-name">{{ name }}</h2>
  <div v-if="this.lines">
    <Line v-for="(line, index) in this.lines" :key="index" :line="line"/>
  </div>
</template>

<script>
import Line from "@/components/Line";

export default {
  name: "Stop",
  components: {
    Line
  },
  props: {
    stop: Object,
    lines: [Object]
  },
  data() {
    return {
      name: this.stop.name,
      stopIDs: this.stop.stopIDs,
      minutesToStopByFoot: this.stop.minutesToStopByFoot
    }
  }
}
</script>

<style scoped>
.stop-name {
  font-size: 18pt;
  font-weight: bold;

  margin: 0 0 4pt;
}

</style>
