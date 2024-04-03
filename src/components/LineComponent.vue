<template>
  <div class="direction-container">
    <div class="destination-container">
      <div class="destination-text">
        <span class="destination">{{ formatDestinationString(destination) }}</span>
        <span v-if="alternateDestination" class="alternative-destination">
          {{ formatDestinationString(alternateDestination) }}
        </span>
      </div>
    </div>
    <div v-if="departures" class="departures">
      <div v-for="(departure, index) in departures" :key="index" class="departure departure-countdown"
        :class="{ 'show-wheelchair': this.type == 'Tram' }">
        <span
          :class="{ 'alternative-departure': departure.goesToAlternateDestination, 'wheelchair-accessible': departure.wheelchairAccessible }">{{
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
    line: Object,
    type: String
  },
  data() {
    return {
      alternateDestination: null,
    }
  },
  computed: {
    destination: function () {
      // return this.line.towards.trim();
      return this.formatDestinationString(this.line.towards);
    },
    departures: function () {
      this.alternateDestination = null;
      return this.line.departures.departure.slice(0, 3).map(dep => {
        let wheelchairAccessible = dep.vehicle ? dep.vehicle.barrierFree : this.line.barrierFree;

        let towards = this.formatDestinationString(dep.vehicle?.towards);
        if (towards && towards != this.destination) {
          // Check Alt Destination, if not set, set it.
          // If set, compair if identical, if not return null.
          if (!this.alternateDestination) {
            this.alternateDestination = towards;
          } else {
            // Check if identical
            if (this.alternateDestination != towards) return null;
          }
          return {
            goesToAlternateDestination: true,
            countdown: dep.departureTime.countdown,
            wheelchairAccessible: wheelchairAccessible
          };
        } else {
          return {
            goesToAlternateDestination: false,
            countdown: dep.departureTime.countdown,
            wheelchairAccessible: wheelchairAccessible
          }
        }
      }).filter(o => o);
    },
  },
  created() {
    window.addEventListener("resize", (e => this.setScrollClass()));
  },
  destroyed() {
    window.removeEventListener("resize", (e => this.setScrollClass()));
  },
  mounted() {
    this.setScrollClass();
  },
  methods: {
    getTitleCase: function (string) {
      return string.trim().toLocaleLowerCase('de-AT').split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
      }).join(' ');
    },
    formatDestinationString(dest) {
      // Perform the following
      // - Transform to title case, but only if all caps
      // - Strip trailing " S", " U" and " S U"
      // - Strip Prepending "HS Gl. XX - "
      // - trim() the string

      if (!dest) return null;

      let formatted = dest;
      if (formatted === formatted.toUpperCase()) {
        formatted = this.getTitleCase(formatted);
      }

      // Strip trailing " S", " U", and " S U"
      formatted = formatted.replace(/(\sS|\sU|\sS\sU)$/g, '');

      // Strip Prepending "HS Gl. XX - ", where XX is any number
      formatted = formatted.replace(/^HS\s+Gl\.\s?\d\s*-\s*/g, '');

      formatted = formatted.trim();

      return formatted;
    },
    setScrollClass() {
      // For all elements with class "destination-text" that are clipped, add class "scroll"
      let elements = document.getElementsByClassName("destination-text");
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element.scrollWidth > element.clientWidth) {
          element.classList.add("scroll");
        } else {
          element.classList.remove("scroll");
        }
      }
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
  grid-template-columns: 1fr repeat(3, 3em);
  align-items: center;

  width: 100%;
}

.destination-container {
  grid-column: 1/2;
  display: flex;
  overflow: hidden;
}

.destination-text {
  width: 100%;
}

.destination-text.scroll {
  position: relative;
  animation: scroll-text 7s linear infinite;
}

@keyframes scroll-text {
  from {
    left: 100%
  }

  to {
    left: -200%
  }
}

.alternative-destination {
  color: #000;
  background-color: #FFF;
  padding: 0 4pt;
}

.destination,
.alternative-destination {
  white-space: nowrap;
}

.destination:has(~ .alternative-destination):after {
  content: "•";
  padding: 0 8pt;
}

.departures {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: -1/-4;
  justify-content: right;
  text-align: right;
}

.departure {
  font-variant: tabular-nums;
}

.departure-countdown span {
  padding: 0 2pt;
}

.departure-countdown span.alternative-departure {
  color: #000;
  background-color: #FFF;
}

.show-wheelchair .wheelchair-accessible:before {
  content: '';
  display: inline-block;
  height: 0.66em;
  width: 0.66em;
  mask-image: url(src/assets/wheelchair-regular.svg);
  mask-size: contain;
  mask-repeat: no-repeat;
  margin-right: 0.25em;

  background-color: #FFF;
}

.show-wheelchair span.alternative-departure.wheelchair-accessible:before {
  background-color: #000;
}
</style>
