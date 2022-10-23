<template>
  <div id="info-display-winf">
    <div id="top-bar">
      <div id="top-bar-row-container">
        <div class="beta-badge">BETA</div>
        <Clock/>
      </div>
      <hr>
    </div>
    <div v-if="wlResponse && !dataOutdated" id="departure-monitor">
      <Stop v-for="(stop, index) in this.stops" :key="index" :stop="stop" :wlResponse="wlResponse"/>
    </div>
    <div v-if="!wlResponse || dataOutdated">
      <div>Keine Echtzeitdaten</div>
    </div>
  </div>
</template>

<script>
import Clock from "./components/Clock.vue";
import Stop from "./components/Stop.vue";

import CONFIG from './config/config.json';

export default {
  name: 'App',
  components: {
    Clock,
    Stop,
  },
  data() {
    return {
      stops: CONFIG.stops,

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
      fetch('/ogd_realtime/monitor?'
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
    // Set styles from configs
    var domRoot = document.querySelector(':root');
    for (const [styleKey, styleVar] of Object.entries(CONFIG.style)) {
      domRoot.style.setProperty(styleKey, styleVar);
    }

    // Get all DIVAs
    let DIVAs = new Set(
        this.stops.map(stop => {
          return stop.diva
        })
    );

    // form http query params
    DIVAs.forEach(diva => {
      this.requestParams.append('diva', diva.toString());
    })

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
  padding: 12pt 32pt;
}

#top-bar {
  margin-bottom: var(--clock-font-size);
}

#top-bar-row-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.beta-badge {
  font-size: var(--clock-font-size);

  background-color: #fff;
  color: #000;

  padding: 0 8pt;
}

#departure-monitor {
}
</style>
