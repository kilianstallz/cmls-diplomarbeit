<script>
import Highchart from 'highcharts'
const conn = new WebSocket('ws://localhost:3001/ws')
const chart = []
export default {
  methods: {
    renderChart () {
      const data = chart.map(v => (v['18871884'].P))
      Highchart.chart('chart', {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Test Charger'
        },
        xAxis: {
          categories: ['time']
        },
        yAxis: {
          title: {
            text: 'Charger'
          }
        },
        series: [{
          name: 'C1',
          data: data
        }]
      })
    }
  },
  mounted () {
    let i = 0
    conn.addEventListener('message', msg => {
      if (msg.data.startsWith('{') && (i % 2 === 0)) {
        const data = JSON.parse(msg.data)
        chart.push(data)
        if (chart.length > 50) {
          chart.pop()
        }
        this.renderChart()
      }
      i++
    })
  }
}
</script>

<template>
  <div id="app">
    <div id="chart" style="width: 100%; height: 500px;"></div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
