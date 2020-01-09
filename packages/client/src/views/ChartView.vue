<script>
import Highchart from 'highcharts'
import MQTT from 'mqtt'
let chart = []
export default {
  name: 'chartView',
  data () {
    return {
      data: [],
      currentState: 0
    }
  },
  methods: {
    renderChart () {
      const dataP = chart.map(v => (v[this.$route.params.device].P))
      const dataI1 = chart.map(v => (v[this.$route.params.device].I1))
      const dataI2 = chart.map(v => (v[this.$route.params.device].I2))
      const dataI3 = chart.map(v => (v[this.$route.params.device].I3))
      Highchart.chart('chart', {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Ladestation'
        },
        xAxis: {
          categories: ['time']
        },
        yAxis: {
          title: {
            text: 'Ladeleistung'
          }
        },
        series: [{
          name: 'Ladeleistung',
          data: dataP
        }
        ]
      })
      Highchart.chart('current', {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Ladestrom'
        },
        xAxis: {
          categories: ['time']
        },
        yAxis: {
          title: {
            text: 'Ladestrom'
          }
        },
        series: [
          { name: 'I1', data: dataI1 },
          { name: 'I2', data: dataI2 },
          { name: 'I3', data: dataI3 }
        ]
      })
    }
  },
  mounted () {
    const mqttClient = MQTT.connect('mqtt://docker.htl-wels.at', {
      port: 1883,
      username: 'energieHTL',
      password: 'NiceWeather'
    })
    mqttClient.subscribe('/energie/wallboxStatus')
    mqttClient.on('message', (topic, payload) => {
      console.log(topic, payload.toString())
    })
  }
}
</script>

<template>
  <div>
    <h1>Daten Ladestation {{ $route.params.device }}</h1>
    <div>
      <h3>Status: {{currentState === 0 ? 'Bereit' : 'Lädt'}}</h3>
    </div>
    <div class="container">
        <div id="chart" style="width: 100%; height: 500px;"></div>
        <div id="current" style="width: 100%; height: 500px;"></div>
    </div>
    <button @click="$router.push('/')">Zurück</button>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto
}
</style>
