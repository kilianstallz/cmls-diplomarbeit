import { Socket } from 'dgram'
import { udpResponseHandler } from '../../handlers/udp/response.handler'
import { timer, from, Observable } from 'rxjs'
import { concatMap } from 'rxjs/operators'

import {appConfig} from '../../app'

export const mountPollObervers = (socket: Socket) => {
  socket.on('listening', () => {
    timer(0, appConfig.udp.pollIntervall)
      .pipe(concatMap(() => from(sendUDP(socket, 'report 2')))) // add more req to pipe with . stacking
      .pipe(concatMap(() => from(sendUDP(socket, 'report 3')))) // add more req to pipe with . stacking
      .subscribe({
        error: err => console.log(err),
      })
  })

  const udpMessage$ = Observable.create(observer => {
    socket.on('message', (msg, rinfo) => {
      observer.next({ msg: msg.toString(), rinfo })
    })
  })

  udpMessage$.subscribe({
    next: ({msg, rinfo}) => {
      console.log(`UDP: ${rinfo.address}:${rinfo.port} - size:${rinfo.size}`)
      udpHandler(msg)
    },
  })
}

function udpHandler(msg: Buffer) {
  const conv = msg.toString()
  if (conv.startsWith('{')) {
    const parsed = JSON.parse(conv)
    udpResponseHandler(parsed)
  } else {
    return conv
  }
}

function sendUDP(socket, msg: string): Promise<void> {
  return new Promise((resolve, reject) => {
      appConfig.chargers.forEach(dev => {
          socket.send(msg, dev.port, dev.address, (err, bytes) => {
              if (err) {
                  console.error('Error Sending:', err)
                  reject(err)
              }
          })
          resolve()
      })
  })
}