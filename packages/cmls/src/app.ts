import { observableFromSocket } from './udp/socket'
import { pollLoop } from './udp/poller'
// import * as chalk from 'chalk'
import { createSocket } from 'dgram'
import { fromEvent } from 'rxjs'
import { eventBus } from './eventBus'
import { UDP_NEW_MESSAGE } from './types/eventTypes'
import { mountUDPEventListener } from './udp/eventListener'
import express from 'express'
import {createServer} from 'http'
import socketIO from 'socket.io'
import { modbusPVPoller } from './modbus/poller'
import './modbus/eventListeners'

const server = express()
const http = createServer(server)
const io = socketIO(http)

const socket = createSocket('udp4')
socket.bind(7090)

const socket$ = observableFromSocket((buffer, remoteInfo) => ({
  msg: buffer.toString(),
  rinfo: remoteInfo
}), socket)

const socketSub = socket$.subscribe({
  next: ({msg, rinfo}) => {
    // Send Message event
    eventBus.emit(UDP_NEW_MESSAGE, {
      type: UDP_NEW_MESSAGE,
      rinfo,
      isData: msg.startsWith('{\n"ID"'),
      message: msg
    })
  },
})
// Poller
pollLoop(socket, 3000)
modbusPVPoller(5000)

mountUDPEventListener()

eventBus.on('sendUDP', (payload) => {
  const {message, port, address} = payload
  socket.send(message, port, address)
})


// Socket IO für die Echtzeit Übertragung von Daten zu Client ohne MQTT
io.on('connection', socket => {
  console.log('Nutzer verbunden.')
  socket.on('disconnect', () => {
    console.log('Nutzer getrennt')
  })
})

http.listen('3000', function () {
  console.log(`HTTP Server listening on port 3000`)
})

export { socket, socket$ }
