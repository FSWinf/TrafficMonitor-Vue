<template>
  <div v-if="wlResponse" class="stop">
    <h2 v-if="lines" class="stop-name">{{ name }}</h2>
    <LineGroup v-for="name in this.lineGroupNames" :key="name" :lines="getLinesByName(name)" :name="name"/>
  </div>
</template>

<script>
import LineGroup from "@/components/LineGroup";

export default {
  name: "Stop",
  components: {
    LineGroup
  },
  props: {
    stop: Object,
    wlResponse: Object
  },
  data() {
    return {
      name: this.stop.name,
      stopIDs: this.stop.stopIDs,
      minutesToStopByFoot: this.stop.minutesToStopByFoot,

      lines: []
    }
  },
  methods: {
    getLinesByName(name) {
      if (this.wlResponse) {
        return this.wlResponse.data.monitors
            .filter(monitor => {
              return this.stopIDs.includes(monitor.locationStop.properties.attributes.rbl);
            })
            .flatMap(monitor => monitor.lines)
            .filter(line => line.name === name)
      } else return []
    }
  },
  computed: {
    lineGroupNames: function () {
      if (this.wlResponse) {
        return new Set(
            this.wlResponse.data.monitors
                .filter(monitor => {
                  return this.stopIDs.includes(monitor.locationStop.properties.attributes.rbl);
                })
                .flatMap(monitor => monitor.lines)
                .map(line => line.name)
        );
      } else return new Set();
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
