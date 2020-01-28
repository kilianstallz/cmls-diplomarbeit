import { observableFromSocket } from './udp/socket'
import { pollLoop } from './udp/poller'
// import * as chalk from 'chalk'
import { createSocket } from 'dgram'
import { fromEvent } from 'rxjs'
import { eventBus } from './eventBus'
import { UDP_NEW_MESSAGE } from './types/eventTypes'
import { mountUDPEventListener } from './udp/eventListener'

const socket = createSocket('udp4')
socket.bind(7090)

const socket$ = observableFromSocket((buffer, remoteInfo) => ({
  msg: buffer.toString(),
  rinfo: remoteInfo
}), socket)

const socketSub = socket$.subscribe({
  next: ({msg, rinfo}) => {
    // Send Message event
    eventBus.emit('UDP', {
      type: UDP_NEW_MESSAGE,
      isData: msg.startsWith('{'),
      message: msg
    })
  },
})
pollLoop(socket, 3000)

mountUDPEventListener()

fromEvent(process, 'beforeExit').subscribe(() => {
  socketSub.unsubscribe()
})

export { socket, socket$ }
