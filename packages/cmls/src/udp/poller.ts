import { Socket, RemoteInfo } from 'dgram'
import { Observable, of, from } from 'rxjs'
import { map, delay, repeat, concatMap } from 'rxjs/operators'
import { logger } from '../logger'
/**
 * Poller
 */
export function pollLoop(socket: Socket, intervall: number) {
    const poller = from(['172.17.68.81', '172.17.68.83']).pipe(
      concatMap(item => of(item).pipe(
        concatMap(recv => from(['report 1', 'report 2', 'report 3']).pipe(
          concatMap((item: string) => of(item).pipe(
            map((msg: string) => {
              socket.send(Buffer.from(msg), 7090, recv, error => {
                if(error) {
                  logger.error('poller.udp.pollLoop.failed - ' + error.message)
                }
              })
              return msg
            }),
            delay(400)
          ))
        )),
        delay(600)
      ))
    ).pipe(
      delay(intervall),
      repeat()
    )
  
    poller.subscribe({
      error: e => {
          if (e) {
              console.log('Error', e)
              logger.error('udp.poller.error', e)
          }
      }
    })
  }