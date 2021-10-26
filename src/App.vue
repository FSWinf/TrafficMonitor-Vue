<template>
  <div id="top-bar">
    <Clock :dateNow="dateNow"/>
  </div>
  <div id="departure-monitor">
    <Stop v-for="(stop, index) in this.stops" :key="index" :stop="stop" :lines="stopLinesMap.get(stop)"/>
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
        name: "Bärenmühlendurchgang",
        stopIDs: [1679],
        minutesToStopByFoot: 3
      },
      {
        name: "Resselgasse",
        stopIDs: [1709, 4843, 5628],
        minutesToStopByFoot: 3
      },
      {
        name: "Karlsplatz",
        stopIDs: [1490, 4109, 4120, 4202, 4213, 4416, 4421],
        minutesToStopByFoot: 5
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

      stopLinesMap: new Map(),

      lines: undefined,

      requestParams: new URLSearchParams(
          {}
      ),

      updateWLIntervalEvent: Number,
      updateTimeIntervalEvent: Number,
      dateNow: new Date()
    }
  },
  methods: {
    _updateTime() {
      this.dateNow = new Date();
    },
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
            this._processResponse(json);
          });

    },
    _processResponse(response) {
      for (let stop of this.stops) {
        let lines = [];
        response.data.monitors.filter(monitor => {
              return  stop.stopIDs.includes(monitor.locationStop.properties.attributes.rbl);
            }
        ).forEach(monitor => {
          lines = lines.concat(monitor.lines);
        });
        this.stopLinesMap.set(stop, lines);
      }
    }
  },
  mounted() {
    let stopIDs = new Set([
      // DIVA 60200193
      1679, // Bärenmühlendurchgang - 59A-H (-> Bhf. Meidling S U)
      // 1704, // Bärenmühlendurchgang - 59A-R (-> Oper, Karlsplatz U)

      // DIVA 60201094
      1709, // Resselgasse - 62-H (and other trams, -> Southbound)
      4843, // Resselgasse - 62-R (and other trams, -> Northbound)
      5628, // Resselgasse - N66

      // DIVA 60200657
      1490, // Karlsplatz U - 4A
      // 1502, // Karlsplatz U - 4E
      // 1680, // Karlsplatz U - 59A
      // 1756, // Karlsplatz U - 62
      // 2610, // Karlsplatz / Lothringerstraße -
      // 2611, // Karlsplatz U -
      4109, // Karlsplatz - U1-H (-> Leopoldau)
      4120, // Karlsplatz - U1-R (-> Oberlaa)
      4202, // Karlsplatz - U2-R
      4213, // Karlsplatz - U2-H
      4416, // Karlsplatz - U4-R (-> Hütteldorf)
      4421, // Karlsplatz - U4-H (-> Heiligenstadt)
      // 5407, // Karlsplatz U -
      // 5573, // Karlsplatz U -

      // DIVA 60200975
      // 13, Oper, Karlsplatz U - 1
      // 51, Oper, Karlsplatz U - 2
      // 1678, Oper, Karlsplatz U - 59A, N62
      // 1710, Oper, Karlsplatz U - 62
      // 2923, Oper, Karlsplatz U - 3A
      // 5600, Oper, Karlsplatz U - N60-R
      // 5601, Oper, Karlsplatz U -
      // 5602, Oper, Karlsplatz U - N36
      // 5603, Oper, Karlsplatz U -
      // 5604, Oper, Karlsplatz U - N66
      // 5605, Oper, Karlsplatz U - N25
      // 5606, Oper, Karlsplatz U - N71
      // 5607, Oper, Karlsplatz U - N49
      // 5943, Karlsplatz - WLB
    ]);

    for (let stopID of stopIDs) {
      this.requestParams.append('stopId', stopID.toString());
    }

    // let divas = new Set([
    //   60200657, // Karlsplatz
    //   60200193, // Bärenmühlendurchgang
    //   60201094, // Resselgasse
    // ]);
    //
    // for (let diva of divas) {
    //   this.requestParams.append('diva', diva.toString());
    // }

    this._updateWL();
    this.updateWLIntervalEvent = window.setInterval(this._updateWL, 10 * 1000);
    this.updateTimeIntervalEvent = window.setInterval(this._updateTime, 500);
  },
  beforeUnmount() {
    clearInterval(this.updateWLIntervalEvent);
    clearInterval(this.updateTimeIntervalEvent);
  }
}
</script>

<style>
:root {
  font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFF;
  background-color: #0C0C0C;

  padding: 12pt 32pt;
}

#top-bar {
  margin-bottom: 24pt;
}

#departure-monitor {
}
</style>
