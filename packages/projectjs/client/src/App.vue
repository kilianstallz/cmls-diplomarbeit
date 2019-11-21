<script>
import LineChart from "./components/LineChart";
import { mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
export default {
  name: "App",
  components: { LineChart },
  mixins: [reactiveProp],
  data() {
    return {
      show: false,
      deviceMap: {},
      valStore: {}
    };
  },
  mounted() {
    const ws = new WebSocket("ws://localhost:3001/");
    ws.onmessage = data => {
      console.log("MSG");
      if (data.data.startsWith("{")) {
        const _data = JSON.parse(data.data);
        delete _data.time;
        this.deviceMap = { ..._data };
        Object.keys(_data).map(ip => {
          if (!this.valStore[ip]) {
            this.valStore[ip] = [];
          }
          this.valStore[ip].push({ ..._data[ip].currentState, address: ip });
        });
      }
    };
  }
};
</script>

<template>
  <div id="app"></div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
