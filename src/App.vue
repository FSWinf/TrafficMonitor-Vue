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
            sender: 'APIKEY',
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
      fetch('//localhost:8010/www.wienerlinien.at/ogd_realtime/monitor?'
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
    _mockUpdateWL() {
      let json = {
        "data": {
          "monitors": [
            {
              "locationStop": {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    16.3663963,
                    48.1904041
                  ]
                },
                "properties": {
                  "name": "60200604",
                  "title": "Johann-Strauß-Gasse",
                  "municipality": "Wien",
                  "municipalityId": 90001,
                  "type": "stop",
                  "coordName": "WGS84",
                  "attributes": {
                    "rbl": 1713
                  }
                }
              },
              "lines": [
                {
                  "name": "1",
                  "towards": "Stefan-Fadinger-Platz",
                  "direction": "H",
                  "platform": "1",
                  "richtungsId": "1",
                  "barrierFree": false,
                  "realtimeSupported": true,
                  "trafficjam": false,
                  "departures": {
                    "departure": [
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:48:30.000+0100",
                          "timeReal": "2021-02-23T20:49:34.000+0100",
                          "countdown": 1
                        },
                        "vehicle": {
                          "name": "1",
                          "towards": "Stefan-Fadinger-Platz",
                          "direction": "H",
                          "richtungsId": "1",
                          "barrierFree": true,
                          "realtimeSupported": true,
                          "trafficjam": false,
                          "type": "ptTram",
                          "attributes": {},
                          "linienId": 101
                        }
                      },
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:58:30.000+0100",
                          "timeReal": "2021-02-23T21:00:25.000+0100",
                          "countdown": 12
                        },
                        "vehicle": {
                          "name": "1",
                          "towards": "Stefan-Fadinger-Platz",
                          "direction": "H",
                          "richtungsId": "1",
                          "barrierFree": true,
                          "realtimeSupported": true,
                          "trafficjam": false,
                          "type": "ptTram",
                          "attributes": {},
                          "linienId": 101
                        }
                      }
                    ]
                  },
                  "type": "ptTram",
                  "lineId": 101
                }
              ],
              "attributes": {}
            },
            {
              "locationStop": {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    16.3657455,
                    48.1895169
                  ]
                },
                "properties": {
                  "name": "60200604",
                  "title": "Johann-Strauß-Gasse",
                  "municipality": "Wien",
                  "municipalityId": 90001,
                  "type": "stop",
                  "coordName": "WGS84",
                  "attributes": {
                    "rbl": 1752
                  }
                }
              },
              "lines": [
                {
                  "name": "1",
                  "towards": "Prater Hauptallee",
                  "direction": "R",
                  "platform": "2",
                  "richtungsId": "2",
                  "barrierFree": false,
                  "realtimeSupported": true,
                  "trafficjam": false,
                  "departures": {
                    "departure": [
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:48:00.000+0100",
                          "timeReal": "2021-02-23T20:48:35.000+0100",
                          "countdown": 0
                        },
                        "vehicle": {
                          "name": "1",
                          "towards": "Prater Hauptallee",
                          "direction": "R",
                          "richtungsId": "2",
                          "barrierFree": true,
                          "realtimeSupported": true,
                          "trafficjam": false,
                          "type": "ptTram",
                          "attributes": {},
                          "linienId": 101
                        }
                      },
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:53:00.000+0100",
                          "timeReal": "2021-02-23T20:53:27.000+0100",
                          "countdown": 5
                        },
                        "vehicle": {
                          "name": "1",
                          "towards": "Marsanogasse, Betriebsbhf. Gürtel",
                          "direction": "R",
                          "richtungsId": "2",
                          "barrierFree": false,
                          "realtimeSupported": true,
                          "trafficjam": false,
                          "type": "ptTram",
                          "attributes": {},
                          "linienId": 101
                        }
                      }
                    ]
                  },
                  "type": "ptTram",
                  "lineId": 101
                }
              ],
              "attributes": {}
            },
            {
              "locationStop": {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    16.3622555,
                    48.1899877
                  ]
                },
                "properties": {
                  "name": "60200768",
                  "title": "Leibenfrostgasse",
                  "municipality": "Wien",
                  "municipalityId": 90001,
                  "type": "stop",
                  "coordName": "WGS84",
                  "attributes": {
                    "rbl": 672
                  }
                }
              },
              "lines": [
                {
                  "name": "13A",
                  "towards": "Hauptbahnhof S U",
                  "direction": "H",
                  "platform": "1",
                  "richtungsId": "1",
                  "barrierFree": true,
                  "realtimeSupported": true,
                  "trafficjam": false,
                  "departures": {
                    "departure": [
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:53:30.000+0100",
                          "timeReal": "2021-02-23T20:51:30.000+0100",
                          "countdown": 3
                        }
                      },
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T21:01:00.000+0100",
                          "timeReal": "2021-02-23T21:00:40.000+0100",
                          "countdown": 12
                        }
                      }
                    ]
                  },
                  "type": "ptBusCity",
                  "lineId": 413
                }
              ],
              "attributes": {}
            },
            {
              "locationStop": {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    16.3637025,
                    48.1899297
                  ]
                },
                "properties": {
                  "name": "60200768",
                  "title": "Leibenfrostgasse",
                  "municipality": "Wien",
                  "municipalityId": 90001,
                  "type": "stop",
                  "coordName": "WGS84",
                  "attributes": {
                    "rbl": 696
                  }
                }
              },
              "lines": [
                {
                  "name": "13A",
                  "towards": "Alser Straße, Skodagasse",
                  "direction": "R",
                  "platform": "2",
                  "richtungsId": "2",
                  "barrierFree": true,
                  "realtimeSupported": true,
                  "trafficjam": false,
                  "departures": {
                    "departure": [
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:51:30.000+0100",
                          "timeReal": "2021-02-23T20:49:41.000+0100",
                          "countdown": 1
                        }
                      },
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:59:00.000+0100",
                          "timeReal": "2021-02-23T20:59:00.000+0100",
                          "countdown": 11
                        }
                      }
                    ]
                  },
                  "type": "ptBusCity",
                  "lineId": 413
                }
              ],
              "attributes": {}
            },
            {
              "locationStop": {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    16.3663963,
                    48.1904041
                  ]
                },
                "properties": {
                  "name": "60200604",
                  "title": "Johann-Strauß-Gasse",
                  "municipality": "Wien",
                  "municipalityId": 90001,
                  "type": "stop",
                  "coordName": "WGS84",
                  "attributes": {
                    "rbl": 1713
                  }
                }
              },
              "lines": [
                {
                  "name": "62",
                  "towards": "Lainz, Wolkersbergenstraße",
                  "direction": "H",
                  "platform": "1",
                  "richtungsId": "1",
                  "barrierFree": true,
                  "realtimeSupported": true,
                  "trafficjam": false,
                  "departures": {
                    "departure": [
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:54:00.000+0100",
                          "timeReal": "2021-02-23T20:54:00.000+0100",
                          "countdown": 6
                        }
                      },
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T21:04:00.000+0100",
                          "timeReal": "2021-02-23T21:04:27.000+0100",
                          "countdown": 16
                        }
                      }
                    ]
                  },
                  "type": "ptTram",
                  "lineId": 162
                }
              ],
              "attributes": {}
            },
            {
              "locationStop": {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    16.3657455,
                    48.1895169
                  ]
                },
                "properties": {
                  "name": "60200604",
                  "title": "Johann-Strauß-Gasse",
                  "municipality": "Wien",
                  "municipalityId": 90001,
                  "type": "stop",
                  "coordName": "WGS84",
                  "attributes": {
                    "rbl": 1752
                  }
                }
              },
              "lines": [
                {
                  "name": "62",
                  "towards": "Oper, Karlsplatz U",
                  "direction": "R",
                  "platform": "2",
                  "richtungsId": "2",
                  "barrierFree": true,
                  "realtimeSupported": true,
                  "trafficjam": false,
                  "departures": {
                    "departure": [
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:52:00.000+0100",
                          "timeReal": "2021-02-23T20:52:27.000+0100",
                          "countdown": 4
                        }
                      }
                    ]
                  },
                  "type": "ptTram",
                  "lineId": 162
                }
              ],
              "attributes": {}
            },
            {
              "locationStop": {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    16.3657455,
                    48.1895169
                  ]
                },
                "properties": {
                  "name": "60200604",
                  "title": "Johann-Strauß-Gasse",
                  "municipality": "Wien",
                  "municipalityId": 90001,
                  "type": "stop",
                  "coordName": "WGS84",
                  "attributes": {
                    "rbl": 1752
                  }
                }
              },
              "lines": [
                {
                  "name": "WLB",
                  "towards": "Wien Oper",
                  "direction": "H",
                  "platform": "1",
                  "richtungsId": "1",
                  "barrierFree": false,
                  "realtimeSupported": true,
                  "trafficjam": false,
                  "departures": {
                    "departure": [
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:50:00.000+0100",
                          "timeReal": "2021-02-23T20:50:01.000+0100",
                          "countdown": 2
                        }
                      },
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:57:00.000+0100",
                          "timeReal": "2021-02-23T20:57:00.000+0100",
                          "countdown": 9
                        }
                      }
                    ]
                  },
                  "type": "ptTramWLB",
                  "lineId": 399
                }
              ],
              "attributes": {}
            },
            {
              "locationStop": {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    16.3663963,
                    48.1904041
                  ]
                },
                "properties": {
                  "name": "60200604",
                  "title": "Johann-Strauß-Gasse",
                  "municipality": "Wien",
                  "municipalityId": 90001,
                  "type": "stop",
                  "coordName": "WGS84",
                  "attributes": {
                    "rbl": 1713
                  }
                }
              },
              "lines": [
                {
                  "name": "WLB",
                  "towards": "Baden Josefspl.",
                  "direction": "R",
                  "platform": "2",
                  "richtungsId": "2",
                  "barrierFree": false,
                  "realtimeSupported": true,
                  "trafficjam": false,
                  "departures": {
                    "departure": [
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:45:00.000+0100",
                          "timeReal": "2021-02-23T20:48:04.000+0100",
                          "countdown": 0
                        }
                      },
                      {
                        "departureTime": {
                          "timePlanned": "2021-02-23T20:52:00.000+0100",
                          "timeReal": "2021-02-23T20:52:03.000+0100",
                          "countdown": 4
                        },
                        "vehicle": {
                          "name": "WLB",
                          "towards": "Inzersdorf",
                          "direction": "R",
                          "richtungsId": "2",
                          "barrierFree": false,
                          "realtimeSupported": true,
                          "trafficjam": false,
                          "type": "ptTramWLB",
                          "attributes": {},
                          "linienId": 399
                        }
                      }
                    ]
                  },
                  "type": "ptTramWLB",
                  "lineId": 399
                }
              ],
              "attributes": {}
            }
          ]
        },
        "message": {
          "value": "OK",
          "messageCode": 1,
          "serverTime": "2021-02-23T20:47:57.000+0100"
        }
      };
      let lines = [];
      json.data.monitors.forEach(monitor => {
            lines = lines.concat(monitor.lines)
          }
      );
      this.lines = lines;

    },
  },
  mounted() {
    let rbls = new Set([1713, 5688, 1752, 696, 672]);

    for (let rbl of rbls) {
      this.requestParams.append('rbl', rbl.toString());
    }

    // this._updateWL();
    this._mockUpdateWL();
    this.intervalEvent = window.setInterval(this._mockUpdateWL, 20 * 1000);
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
