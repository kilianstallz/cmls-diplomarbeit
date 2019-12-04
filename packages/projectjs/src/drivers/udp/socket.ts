import { Socket, createSocket } from 'dgram'
import { testHandler } from '../../handlers/udp/udpTest.handler'
import { udpResponseHandler } from '../../handlers/udp/response.handler'
import { timer, from, Observable } from 'rxjs'
import { concatMap } from 'rxjs/operators'

export class UDPSocket {
  socket: Socket
  deviceConfig: any
  constructor(port: number = 7090, private store, test: boolean = false) {
    this.initSocket(port, test)
      this.mountPollObervers()
  }

  // Create the socket and bind to the client port
  private initSocket(port: number = 7090, test: boolean = false) {
    this.socket = createSocket('udp4')
    this.socket.bind(port)
    if (test) {
      testHandler(this.socket)
    }
    const fromStore = this.store.get('deviceConfig')
    if(fromStore) {
        this.deviceConfig = fromStore
    } else {
        this.deviceConfig = []
    }
  }

/**
 * Create and call pollers and observers on the udp message listener
 * @param intervall The polling intervall
 */
private mountPollObervers(intervall: number = 5000): void {
    // Create a poller with timer function
    this.socket.on('listening', () => {
      timer(0, intervall)
        .pipe(concatMap(() => from(this.sendUDP('report 2')))) // add more req to pipe with . stacking
        .pipe(concatMap(() => from(this.sendUDP('report 3')))) // add more req to pipe with . stacking
        .subscribe({
          error: err => console.log(err),
        })
    })

    const udpMessage$ = Observable.create(observer => {
      this.socket.on('message', (msg, rinfo) => {
        observer.next({ msg: msg.toString(), rinfo })
      })
    })

    udpMessage$.subscribe({
      next: ({msg, rinfo}) => {
        console.log(`UDP: ${rinfo.address}:${rinfo.port} - size:${rinfo.size}`)
        this.udpHandler(msg)
      },
    })
  }

  /** 
   * First Instance of message handling 
   * response: Sent to `udpResponseHandler`
   * status/error: Sent to `udpErrorHandler`
   */ 
  private udpHandler(msg: Buffer) {
    const conv = msg.toString()
    if (conv.startsWith('{')) {
      const parsed = JSON.parse(conv)
      udpResponseHandler(parsed)
    } else {
      return conv
    }
  }

  /**
   * Send the request to the provided IP Addresses
   */
  private sendUDP(msg: string): Promise<void> {
    return new Promise((resolve, reject) => {
        this.deviceConfig.forEach(dev => {
            this.socket.send(msg, dev.port, dev.address, (err, bytes) => {
                if (err) {
                    console.error('Error Sending:', err)
                }
            })
            resolve()
        })
    })
  }
}
