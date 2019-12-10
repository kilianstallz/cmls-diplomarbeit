module.exports = {
  udp: {
    port: 7090,
    pollIntervall: 5000
  },
  mqtt: {
    options: {
      port: 1883,
      username: 'energieHTL',
      password: 'niceWeather',
      protocol: 'mqtt'
    },
    brokerUrl: 'mqtt://docker.htl-wels.at'
  },
  chargers: [
    {address: 'localhost', port: 7090}
  ]
}