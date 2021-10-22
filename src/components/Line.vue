<template>
  <div id="line" v-if="destination">
    <div id="line-number-box" :style="style">
      <div id="line-number">{{ lineName }}</div>
      <div id="line-artwork" v-if="false">WLB ARTWORK HERE</div>
    </div>
    <div id="direction-container">
      <div id="destination-container">
        <div id="destination">{{ destination }}</div>
        <div id="alternative-destination" v-if="alternateDestination">
          {{ alternateDestination }}
        </div>
      </div>
      <div id="departures" v-if="departures">
        <div class="departure departure-countdown" v-for="(departure, index) in departures" :key="index"
             :class="{'alternative-departure': departure.goesToAlternateDestination}">
          {{ departure.countdown }}
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import getWLColor from "../wl-color.js";

export default {
  name: "Line",
  components: {},
  props: {line: Object},
  data() {
    return {
      style: getWLColor(this.line.name),
      lineName: String,
      destination: String,
      alternateDestination: String,
      departures: {
        goesToAlternateDestination: Boolean,
        countdown: Number
      }
    }
  },
  mounted() {
    this.lineName = this.line.name;
    this.destination = this.line.towards;
    this.alternateDestination = null;
    this.departures = this.line.departures.departure.slice(0, 2).map(dep => {
      let isAlternative = false;
      if (dep.vehicle?.towards && dep.vehicle?.towards !== this.destination) {
        isAlternative = true;
        this.alternateDestination = dep.vehicle?.towards;
      }
      return {
        goesToAlternateDestination: isAlternative,
        countdown: dep.departureTime.countdown
      }
    })
  }
}
</script>

<style scoped>
#line {
  display: grid;
  grid-template-columns: 64pt 1fr;
  grid-gap: 12pt;
  padding-bottom: 8pt;
}

#line-number-box {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #333333;
  border-radius: 4pt;
  padding: 2pt 8pt;

  width: 52pt;
}

#line-number {
  font-weight: bold;
  font-size: 24pt;

  font-variant-numeric: proportional-nums;
}

#direction-container {
  font-size: 16pt;

  display: grid;
  grid-template-columns: 1fr 4em;
  align-items: center;

  width: 100%;
}

#destination-container {
  display: flex;
}

#alternative-destination {
  color: #91C36C;
  grid-column: 1/2;
}

#alternative-destination:before {
  content: "•";
  padding: 0 8pt;
}

#departures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: left;

  text-align: right;
}

.departure {
  font-variant: tabular-nums;
  padding-left: 8pt;
}

.alternative-departure {
  color: #91C36C;
}
</style>
