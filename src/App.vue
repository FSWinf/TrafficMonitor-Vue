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
          {}
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
                  lines = lines.concat(monitor.lines)
                }
            );
            this.lines = lines;
          });
    },
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
      4109, // Karlsplatz - U1-H (-> LEOPOLDAU)
      4120, // Karlsplatz - U1-R (-> Oberlaa)
      4202, // Karlsplatz - U2-R
      4213, // Karlsplatz - U2-H
      4416, // Karlsplatz - U4-R (-> HÜTTELDORF)
      4421, // Karlsplatz - U4-H (-> HEILIGENSTADT)
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
    // this.intervalEvent = window.setInterval(this._updateWL, 5 * 1000);
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
