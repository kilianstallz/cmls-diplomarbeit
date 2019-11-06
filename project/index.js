import { Application, Poller } from '@chargejs/charge'

const charge = new Application()

charge.start()


const main = new Poller(1000)

main.onPoll(() => {
  // Main loop
  charge.requestUDP({
    port: 7090,
    address: '10.0.0.125',
    message: 'report 1'
  })
  charge.requestUDP({
    port: 7090,
    address: '10.0.0.125',
    message: 'report 2'
  })
  charge.requestUDP({
    port: 7090,
    address: '10.0.0.125',
    message: 'report 3'
  })

  main.poll()
})
main.poll()