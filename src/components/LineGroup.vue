<template>
  <div class="line-group">
    <div :class="[`line-${name}`]" class="line-number-box">
      <div v-if="name !== 'WLB'" class="line-number">{{ name }}</div>
      <div v-if="name === 'WLB'" class="line-artwork">
        <img alt="Badner Bahn" src="@/assets/line-icon-wlb.png">
      </div>
    </div>
    <div class="directions">
      <LineComponent v-for="(line, index) in this.lines" :key="index" :line="line"/>
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
    lines: Array
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

  width: calc(var(--stop-name-font-size) * 2);
}

.line-number {
  font-weight: bold;
  font-size: var(--line-number-font-size);

  font-variant-numeric: proportional-nums;
}

.line-artwork {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 2pt 8pt;
}

.directions .direction-container:not(:last-of-type) {
  margin-bottom: 8pt;
}
</style>
<style scoped src="../assets/line-styles.css"></style>
