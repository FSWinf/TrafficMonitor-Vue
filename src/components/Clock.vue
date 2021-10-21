<template>
  <div class="time">{{timeString}}</div>
  <hr>
</template>

<script>
export default {
  name: "Clock",
  props: {dateNow: Date},
  computed: {
    timeString: function () {
      return this.dateNow.toLocaleTimeString('de-AT');
    }
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
