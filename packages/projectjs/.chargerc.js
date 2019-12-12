module.exports = {
  udp: {
    port: 7090,
    pollIntervall: 12000
  },
  mqtt: {
    options: {
      port: 1883,
      username: 'energieHTL',
      password: 'niceWeather',
      protocol: 'mqtt'
    },
    heartbeatIntervall: 10000,
    brokerUrl: 'mqtt://docker.htl-wels.at'
  },
  chargers: [
    {address: '172.17.68.81', port: 7090},
    {address: '172.17.68.83', port: 7090}
  ]
}