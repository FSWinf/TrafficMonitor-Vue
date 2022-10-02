<template>
  <div v-if="destination" class="line">
    <div :class="[`line-${line.name}`, `type-${line.type}`]" class="line-number-box">
      <div v-if="line.type !== 'ptTramWLB'" class="line-number">{{ line.name }}</div>
      <div v-if="line.type === 'ptTramWLB'" class="line-artwork">
        <img alt="Badner Bahn" src="@/assets/line-icon-wlb.png">
      </div>
    </div>
    <div class="direction-container">
      <div class="destination-container">
        <div class="destination">{{ line.type === 'ptMetro' ? getTitleCase(destination) : destination }}</div>
        <div v-if="alternateDestination" class="alternative-destination">
          {{ line.type === 'ptMetro' ? getTitleCase(alternateDestination) : alternateDestination }}
        </div>
      </div>
      <div v-if="departures" class="departures">
        <div v-for="(departure, index) in departures" :key="index"
             class="departure departure-countdown">
          <span :class="{'alternative-departure': departure.goesToAlternateDestination}">{{
              departure.countdown
            }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LineComponent",
  components: {},
  props: {
    line: Object
  },
  data() {
    return {
      alternateDestination: null,
    }
  },
  computed: {
    destination: function () {
      return this.line.towards.trim();
    },
    departures: function () {
      return this.line.departures.departure.slice(0, 2).map(dep => {
        let destination = this.line.towards.trim();
        let isAlternative = false;
        if (dep.vehicle?.towards && dep.vehicle?.towards.trim().localeCompare(destination.trim(), 'de-AT')) {
          isAlternative = true;
          this.alternateDestination = dep.vehicle?.towards;
        }
        return {
          goesToAlternateDestination: isAlternative,
          countdown: dep.departureTime.countdown
        }
      })
    },
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
  grid-template-columns: 64pt 1fr;
  grid-gap: 12pt;
  padding-bottom: 8pt;
}

.line-number-box {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #1a1a1a;
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

.line-artwork img {
  height: var(--line-number-font-size);
}

.direction-container {
  font-size: var(--text-font-size);

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
  color: #000;
  background-color: #FFF;
  padding: 0 4pt;
  grid-column: 1/2;
}

.destination:after {
  content: " ";
  padding: 0 8pt;
}

.destination:has(~ .alternative-destination):after {
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

.departure-countdown span {
  padding: 2pt;
}

.departure-countdown span.alternative-departure {
  color: #000;
  background-color: #FFF;
}
</style>
<style scoped src="../assets/line-styles.css"></style>
