import { Application, Poller } from '@chargejs/charge'

const charge = new Application()

charge.start()

const mqttClient = charge.mqtt

mqttClient.on('udpMessage', data => {
  console.log(data)
})

const main = new Poller(5000)

main.onPoll(() => {
  // Main loop
  charge.requestUDP({
    port: 7090,
    address: '192.168.0.102',
    message: 'report 1'
  })
  main.poll()
})
main.poll()