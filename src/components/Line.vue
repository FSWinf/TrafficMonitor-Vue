<template>
  <div class="line" v-if="destination">
    <div class="line-number-box" :class="[`line-${line.name}`, `type-${line.type}`]">
      <div class="line-number" v-if="line.type !== 'ptTramWLB'">{{ line.name }}</div>
      <div class="line-artwork" v-if="line.type === 'ptTramWLB'">
        <img src="line-icon-wlb.svg" alt="Badner Bahn">
      </div>
    </div>
    <div class="direction-container">
      <div class="destination-container">
        <div class="destination">{{ destination }}</div>
        <div class="alternative-destination" v-if="alternateDestination">
          {{ alternateDestination }}
        </div>
      </div>
      <div class="departures" v-if="departures">
        <div class="departure departure-countdown" v-for="(departure, index) in departures" :key="index"
             :class="{'alternative-departure': departure.goesToAlternateDestination}">
          {{ departure.countdown }}
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Line",
  components: {},
  props: {line: Object},
  data() {
    return {
      destination: String,
      alternateDestination: String,
      departures: {
        goesToAlternateDestination: Boolean,
        countdown: Number
      }
    }
  },
  mounted() {
    this.destination = this.line.towards.trim();
    this.alternateDestination = null;
    this.departures = this.line.departures.departure.slice(0, 2).map(dep => {
      let isAlternative = false;
      if (dep.vehicle?.towards && dep.vehicle?.towards.trim() !== this.destination) {
        isAlternative = true;
        this.alternateDestination = dep.vehicle?.towards;
      }
      return {
        goesToAlternateDestination: isAlternative,
        countdown: dep.departureTime.countdown
      }
    })

    // Transform destination names into title case if ptMetro (all caps from API)
    if (this.line.type === 'ptMetro') {
      this.destination = this.getTitleCase(this.destination);
      this.alternateDestination =
          this.alternateDestination !== null ? this.getTitleCase(this.alternateDestination) : null;
    }
  },
  methods: {
    getTitleCase: function (string) {
      return string.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
      }).join(' ');
    }
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

.direction-container {
  font-size: 16pt;

  display: grid;
  grid-template-columns: 1fr 4em;
  align-items: center;

  width: 100%;
}

.destination-container {
  display: flex;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alternative-destination {
  color: #91C36C;
  grid-column: 1/2;
}

.alternative-destination:before {
  content: "•";
  padding: 0 8pt;
}

.departures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: right;

  text-align: right;
}

.departure {
  font-variant: tabular-nums;
  padding-left: 8pt;
}

.alternative-departure {
  color: #91c36c;
}
</style>
