<template>
  <div>
    <div class="line-group">
      <div :class="[`line-${name}`, `type-${type}`, hasTrafficInfos ? 'advisory' : '']" class="line-number-box">
        <div class="line-number">{{ name }}</div>
      </div>
      <div class="directions">
        <LineComponent v-for="(line, index) in this.lines" :key="index" :line="line" :type="type"/>
      </div>
    </div>
    <div class="traffic-infos" v-if="hasTrafficInfos">
      <div class="traffic-info" v-for="(info, index) in this.trafficInfos" :key="index">
        <div class="traffic-info-title" v-if="info.description != info.title">{{ info.title }}</div>
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
  computed: {
    hasTrafficInfos() {
      return this.trafficInfos.length > 0;
    }
  }
}
</script>

<style>
.line-group {
  display: grid;
  grid-template-columns: calc(var(--line-number-font-size) * 3) 1fr;
  grid-column-gap: 12pt;
  align-items: center;
  margin-bottom: 12pt;
}

.line-number-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  background-color: #262626;
  border-radius: 4pt;
  padding: 2pt 8pt;

  box-sizing: border-box;
  width: calc(var(--stop-name-font-size) * 2 + 16pt);
}


.line-number-box.advisory::after {
  content: '';
  position: absolute;
  top: 55%;
  right: -10%;
  
  height: 1.25em;
  width: 1.25em;
  mask-image: url(@/assets/warning-triangle-silhouette.svg);
  mask-size: contain;
  mask-repeat: no-repeat;

  background-color: #e7c121;
}

.line-number {
  text-align: center;

  font-weight: bold;
  font-size: var(--line-number-font-size);

  font-variant-numeric: proportional-nums;
}

.directions .direction-container:not(:last-of-type) {
  margin-bottom: 8pt;
}

/* in dark grey box */
.traffic-infos {
  margin-left: calc(var(--line-number-font-size) * 3.5);
}
.traffic-info {
  background-color: #262626;
  padding: var(--text-font-size);
  margin-bottom: calc(var(--info-title-size) * 0.25);
}
.traffic-info-title {
  font-weight: bold;
  font-size: var(--info-title-size);
  margin-bottom: calc(var(--info-title-size) * 0.25);
}
.traffic-info-description {
  font-size: var(--text-font-size);
}

.warning-icon {
  height: 0.85em;
}
</style>
<style scoped src="@/assets/line-styles.css"></style>
