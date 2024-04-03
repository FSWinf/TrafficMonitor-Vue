<template>
  <div class="line-group">
    <div :class="[`line-${name}`, `type-${type}`]" class="line-number-box">
      <div class="line-number">{{ name }}</div>
    </div>
    <div class="directions">
      <LineComponent v-for="(line, index) in this.lines" :key="index" :line="line" :type="type"/>
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
</style>
<style scoped src="../assets/line-styles.css"></style>
