<template>
  <div v-if="wlResponse" class="stop">
    <h2 v-if="lines" class="stop-name">
      {{ name }}
      <span v-if="minutesToStopByFoot" class="walking-time"><img class="walking-time-icon" alt="Waking time" src="@/assets/person-walking-solid.svg">…{{ minutesToStopByFoot }} min
      </span>
    </h2>
    <LineGroup v-for="lineGroupName in this.lineGroupNames" :key="lineGroupName" :lines="getLinesByName(lineGroupName)" :name="lineGroupName" :type="getLineGroupType(lineGroupName)"/>
  </div>
</template>

<script>
import LineGroup from "./LineGroup.vue";

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
      diva: this.stop.diva,
      stopIDs: this.stop.stopIDs,
      minutesToStopByFoot: this.stop.minutesToStopByFoot,
      filterOutLines: this.stop.filterOutLines || [],

      lines: []
    }
  },
  methods: {
    getLinesByName(name) {
      if (this.wlResponse) {
        return this.wlResponse.data.monitors
            .filter(monitor => {
              return this.diva.toString() === monitor.locationStop.properties.name;
            })
            .flatMap(monitor => monitor.lines)
            .filter(line => line.name === name)
      } else return []
    },
    getLineGroupType(name) {
      // Take the first line of the group
      const firstLine = this.getLinesByName(name)[0];
      if (firstLine) {
        // return firstLine.type;
        // Strip prefix "pt" if present
        return firstLine.type.replace(/^pt/, "");
      } else return "";
    }
  },
  computed: {
    lineGroupNames: function () {
      if (this.wlResponse) {
        return new Set(
            this.wlResponse.data.monitors
                .filter(monitor => {
                  return this.diva.toString() === monitor.locationStop.properties.name;
                })
                .flatMap(monitor => monitor.lines)
                .map(line => line.name)
                .filter(lineName => !(this.filterOutLines.includes(lineName)))
        );
      } else return new Set();
    }
  }
}
</script>

<style scoped>
.stop-name {
  font-size: var(--stop-name-font-size);
  font-weight: bold;

  margin: 0 0 4pt;
}

.walking-time {
  font-weight: normal;
  margin-left: 1.5em;
}

.walking-time-icon {
  height: 0.85em;
  color: inherit;
}

</style>
