<template>
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
      this.alternateDestination = null;
      return this.line.departures.departure.slice(0, 3).map(dep => {
        let towards = dep.vehicle?.towards;
        if (towards && towards.trim().localeCompare(this.destination, 'de-AT', {sensitivity: 'base'})) {
          this.alternateDestination = towards.trim();
          return {
            goesToAlternateDestination: true,
            countdown: dep.departureTime.countdown
          };
        } else {
          return {
            goesToAlternateDestination: false,
            countdown: dep.departureTime.countdown
          }
        }
      })
    },
  },
  methods: {
    getTitleCase: function (string) {
      return string.trim().toLocaleLowerCase('de-AT').split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
      }).join(' ');
    }
  }
}
</script>

<style>
.line-artwork img {
  height: var(--line-number-font-size);
}

.direction-container {
  font-size: var(--text-font-size);
  grid-column: 2/3;

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
  grid-template-columns: repeat(3, 2em);
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
