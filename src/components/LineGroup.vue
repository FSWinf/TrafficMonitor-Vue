<template>
  <div class="line-group">
    <LineComponent v-for="(line, index) in this.lines" :key="index" :line="line"/>
  </div>
</template>

<script>
import LineComponent from "@/components/LineComponent";

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
.line {
  display: grid;
  grid-template-columns: 54pt 1fr;
  grid-gap: 12pt;
  padding-bottom: 8pt;
}

.line-number-box {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #404040;
  border-radius: 4pt;
  padding: 2pt 8pt;

  width: 42pt;
}

/* TODO: Put me in a standalone CSS file
   see: https://stackoverflow.com/questions/54977890/how-to-import-css-files-in-vue-components-with-scope-limited-to-components-only
     */
.type-ptMetro.line-U1 {
  background-color: #ed4a72;
}

.type-ptMetro.line-U2 {
  background-color: #9f70ad;
}

.type-ptMetro.line-U3 {
  background-color: #ef825c;
}

.type-ptMetro.line-U4 {
  background-color: #88c25b;
}

.type-ptMetro.line-U5 {
  background-color: #4db2e5;
}

.type-ptMetro.line-U6 {
  background-color: #d95936;
}

.type-ptBusNight {
  background-color: #092940;
  color: #ffe400;
}

.type-ptTramWLB {
  background-color: #fff6d4;
  color: #257299;
}

.line-number {
  font-weight: bold;
  font-size: 18pt;

  font-variant-numeric: proportional-nums;
}

.line-artwork {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 2pt 8pt;
}

.line-artwork img {
  height: 18pt;
}
</style>
