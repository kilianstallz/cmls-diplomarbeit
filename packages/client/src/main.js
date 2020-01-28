import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueMqtt from 'vue-mqtt'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

Vue.use(Chartkick.use(Chart))

Vue.use(VueMqtt, 'ws://docker.htl-wels.at', {
  port: 9001,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'energieHTL',
  password: 'NiceWeather'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
