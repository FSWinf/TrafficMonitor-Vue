<template>
  <div class="line-group">
    <LineComponent v-for="(line, index) in this.lines" :key="index" :line="line"/>
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
  computed: {
  }
}
</script>

<style scoped>
</style>
