<template>
  <div id="info-display-winf">
    <div id="top-bar">
      <div id="top-bar-row-container">
        <div class="beta-badge">BETA</div>
        <Clock/>
      </div>
      <hr>
    </div>
    <div v-if="wlResponse" id="departure-monitor">
      <Stop v-for="(stop, index) in this.stops" :key="index" :stop="stop" :wlResponse="wlResponse"/>
    </div>
  </div>
</template>

<script>
import Clock from "@/components/Clock";
import Stop from "@/components/Stop";

// eslint-disable-next-line no-unused-vars
const CONFIG = {
  transitDepartureWL: {
    stops: [
      {
        name: "Karlsplatz",
        stopIDs: [1490, 4109, 4120, 4202, 4213, 4416, 4421],
        minutesToStopByFoot: 5
      },
      {
        name: "Resselgasse",
        stopIDs: [1709, 4843, 5628],
        minutesToStopByFoot: 3
      },
      {
        name: "Bärenmühlendurchgang",
        stopIDs: [1679],
        minutesToStopByFoot: 3
      },
    ]
  }
}

export default {
  name: 'App',
  components: {
    Clock,
    Stop,
  },
  data() {
    return {
      stops: CONFIG.transitDepartureWL.stops,

      requestParams: new URLSearchParams(
          {}
      ),

      lastUpdated: Date,
      dataOutdated: Boolean,

      wlResponse: undefined,

      updateWLIntervalEvent: Number,
      updateTimeIntervalEvent: Number,
      dateNow: new Date()
    }
  },
  methods: {
    _updateWL() {
      fetch('http://localhost:8080/ogd_realtime/monitor?'
          + this.requestParams,
          {
            headers: {
              'content-type': "application/json;charset=UTF-8"
            }
          }
      )
          .then(response => response.json())
          .then(json => {
            this.lastUpdated = new Date();
            this.dataOutdated = false;
            this.wlResponse = json;
          })
          .catch(() => {
            const now = new Date();
            if (this.lastUpdated && now - this.lastUpdated > 30_000) {
              this.dataOutdated = true;
            }
          });
    },
  },
  mounted() {
    let stopIDs = new Set();

    CONFIG.transitDepartureWL.stops.forEach(stop => {
      stop.stopIDs.forEach(id => stopIDs.add(id));
    })

    for (let stopID of stopIDs) {
      this.requestParams.append('stopId', stopID.toString());
    }

    this._updateWL();
    this.updateWLIntervalEvent = window.setInterval(this._updateWL, 30_000);
  },
  beforeUnmount() {
    clearInterval(this.updateWLIntervalEvent);
  }
}
</script>

<style>
:root {
  --main-font-family: "Ubuntu";

  --stop-name-font-size: 24pt;
  --line-number-font-size: 24pt;
  --text-font-size: 18pt;

  font-family: var(--main-font-family), -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFF;
  background-color: #0C0C0C;

  padding: 12pt 32pt;
}

#top-bar {
  margin-bottom: 24pt;
}

#top-bar-row-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.beta-badge {
  font-size: 24pt;

  background-color: #fff;
  color: #0c0c0c;

  padding: 0 8pt;
}

#departure-monitor {
}
</style>
