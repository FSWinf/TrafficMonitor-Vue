<template>
  <div>
    <div v-if="wlResponse && !dataOutdated" id="departure-monitor">
      <Stop v-for="(stop, index) in this.stops" :key="index" :stop="stop" :wlResponse="wlResponse" />
    </div>
    <div v-if="!wlResponse || dataOutdated">
      <div>Keine Echtzeitdaten</div>
    </div>
  </div>
</template>
  
<script>
import Stop from "./Stop.vue";

import CONFIG from '../config/config.json';

export default {
  name: 'TransitSignage',
  components: {
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
    });
    this.requestParams.append('activateTrafficInfo', 'stoerungkurz');
    // this.requestParams.append('activateTrafficInfo', 'stoerunglang');
    // this.requestParams.append('activateTrafficInfo', 'information');

    this._updateWL();
    this.updateWLIntervalEvent = window.setInterval(this._updateWL, 30_000);
  },
  beforeUnmount() {
    clearInterval(this.updateWLIntervalEvent);
  }
}
</script>
