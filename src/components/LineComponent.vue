<template>
  <div class="direction-container">
    <div class="destination-container">
      <div class="destination">{{ formatDestinationString(destination) }}</div>
      <div v-if="alternateDestination" class="alternative-destination">
        {{ formatDestinationString(alternateDestination) }}
      </div>
    </div>
    <div v-if="departures" class="departures">
      <div v-for="(departure, index) in departures" :key="index" class="departure departure-countdown" :class="{'show-wheelchair': this.type=='Tram'}">
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
  methods: {
    getTitleCase: function (string) {
      return string.trim().toLocaleLowerCase('de-AT').split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
      }).join(' ');
    },
    formatDestinationString(dest) {
      // Perform the following
      // - trim() the string
      // - Transform to title case, but only if all caps
      // - Strip trailing " S", " U" and " S U"
      // - Strip Prepending "Gl. XX - "

      if (!dest) return null;

      let formatted = dest.trim();
      if (formatted === formatted.toUpperCase()) {
        formatted = this.getTitleCase(formatted);
      }

      // Strip trailing " S", " U", and " S U"
      formatted = formatted.replace(/(\sS|\sU|\sS\sU)$/g, '');

      // Strip Prepending "Gl. XX - ", where XX is any number
      formatted = formatted.replace(/^Gl\.\s\d+\s-\s/, '');

      return formatted;
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
  grid-template-columns: repeat(3, 3em);
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

.show-wheelchair .wheelchair-accessible::before {
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

.show-wheelchair span.alternative-departure.wheelchair-accessible::before {
  background-color: #000;
}
</style>
