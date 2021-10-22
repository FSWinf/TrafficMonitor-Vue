<template>
  <div id="top-bar">
    <Clock :dateNow="dateNow"/>
  </div>
  <div id="departure-monitor">
    <div v-if="this.lines">
      <Line v-for="(line, index) in this.lines" :line="line" :key="index"/>
    </div>
  </div>
</template>

<script>
import Clock from "@/components/Clock";
import Line from "@/components/Line";

export default {
  name: 'App',
  components: {
    Clock,
    Line
  },
  data() {
    return {
      lines: undefined,
      requestParams: new URLSearchParams(
          {
          }
      ),
      intervalEvent: undefined,
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
            let lines = [];
            json.data.monitors.forEach(monitor => {
              lines = lines.concat(monitor.lines.map(line => {
                let depTime = line.departures.departure[0]?.departureTime.timeReal;
                return {
                  time: new Date(depTime).getTime(),
                  line
                };
              }))
            });
            lines.sort((a, b) => {
              if (a.time < b.time) {
                return -1;
              } else if (a.time > b.time) {
                return 1;
              } else {
                return 0;
              }
            });
            this.lines = lines.map(it => it.line);
          });
    },
  },
  mounted() {
    // let rbls = new Set([
    //   1490, // Karlsplatz U
    //   1502, // Karlsplatz U
    //   1678, // Oper, Karlsplatz
    //   1679, // Bärenmühlendurchgang
    //   1680, // Karlsplatz U
    //   1709, // Resselgasse
    //   1710, // Karlsplatz U
    //   1756, // Karlsplatz U
    //   2611, // Karlsplatz U
    //   4109, // Karlsplatz
    //   4120, // Karlsplatz
    //   4202, // Karlsplatz
    //   4213, // Karlsplatz
    //   4416, // Karlsplatz
    //   4421, // Karlsplatz
    //   5407, // Karlsplatz U
    //   5416, // Karlsplatz ?
    //   5573, // Karlsplatz U
    //   5943, // Karlsplatz
    //   7316, // Karlsplatz
    // ]);

    // for (let rbl of rbls) {
    //   this.requestParams.append('rbl', rbl.toString());
    // }
    
    let divas = new Set([
      60200657, // Karlsplatz
      60200193, // Bärenmühlendurchgang
      60201094, // Resselgasse
    ]);

    for (let diva of divas) {
      this.requestParams.append('diva', diva.toString());
    }

    // this._updateWL();
    this._updateWL();
    this.intervalEvent = window.setInterval(this._updateWL, 5 * 1000);
    this.intervalEvent = window.setInterval(this._updateTime, 500);
  },
  beforeUnmount() {
    clearInterval(this.intervalEvent);
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
