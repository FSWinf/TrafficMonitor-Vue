<template>
  <div>
    <div class="line-group">
      <div :class="[`line-${name}`, `type-${type}`]" class="line-number-box">
        <div class="line-number">{{ name }}</div>
      </div>
      <div class="directions">
        <LineComponent v-for="(line, index) in this.lines" :key="index" :line="line" :type="type"/>
      </div>
    </div>
    <div class="traffic-infos">
      <div class="traffic-info" v-for="(info, index) in this.trafficInfos" :key="index">
        <div class="traffic-info-title"><img class="warning-icon" src="@/assets/triangle-exclamation-solid.svg"> {{ info.title }}</div>
        <div class="traffic-info-description" v-if="info.description">{{ info.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import LineComponent from "./LineComponent.vue";

export default {
  name: "LineGroup",
  components: {
    LineComponent
  },
  props: {
    name: String,
    type: String,
    lines: Array,
    trafficInfos: Array,
  },
  computed: {}
}
</script>

<style>
.line-group {
  display: grid;
  grid-template-columns: 64pt 1fr;
  grid-column-gap: 12pt;
  align-items: center;
  margin-bottom: 12pt;
}

.line-number-box {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #262626;
  border-radius: 4pt;
  padding: 2pt 8pt;

  box-sizing: border-box;
  width: calc(var(--stop-name-font-size) * 2 + 16pt);
}

.line-number {
  font-weight: bold;
  font-size: var(--line-number-font-size);

  font-variant-numeric: proportional-nums;
}

.directions .direction-container:not(:last-of-type) {
  margin-bottom: 8pt;
}

/* in dark grey box */
.traffic-infos {
  margin-left: 72pt;
}
.traffic-info {
  background-color: #262626;
  padding: 8pt;
  border-radius: 4pt;
  margin-bottom: 8pt;
}
.traffic-info-title {
  font-weight: bold;
  font-size: 16pt;
  margin-bottom: 4pt;
}
.traffic-info-description {
  font-size: 14pt;
}

.warning-icon {
  height: 0.85em;
}
</style>
<style scoped src="@/assets/line-styles.css"></style>
