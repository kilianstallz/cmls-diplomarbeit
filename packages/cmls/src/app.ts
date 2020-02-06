import { pollLoop } from './udp/poller'
// import * as chalk from 'chalk'
import { eventBus } from './eventBus'
import { UDP_NEW_MESSAGE } from './types/eventTypes'
import { mountUDPEventListener } from './udp/eventListener'
import { modbusPVPoller } from './modbus/poller'
import './modbus/eventListeners'
import { EnergyServer } from './EnergyServer'

const server = new EnergyServer()
const app = server.app
const udp = server.udp
const mqtt = server.mqtt

udp.on('message', (msg, rinfo) => {
  const st = msg.toString()
  server.emit(UDP_NEW_MESSAGE, {
    type: UDP_NEW_MESSAGE,
    rinfo,
    isData: st.startsWith('{\n"ID"'),
    message: msg
  })
})

// Poller
pollLoop(udp, 3000)
modbusPVPoller(5000)

mountUDPEventListener()

eventBus.on('sendUDP', (payload) => {
  const {message, port, address} = payload
  udp.send(message, port, address)
})

export { server, udp, app, mqtt }
