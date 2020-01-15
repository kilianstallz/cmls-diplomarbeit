import { udp } from '../app'
import { fromEvent, interval } from 'rxjs'
import { map, skipWhile } from 'rxjs/operators'

export let wallboxSocket$

export const wallboxMap = new Object()

/**
 * Create Emitter
 */

/**
 * wallboxMap$
 * @description Daten Map Observable emitted die aktuellsten Daten für das gesamte Program
 * @config private
 */
export const wallboxMap$ = interval(2000)
  .pipe(map(() => JSON.stringify(wallboxMap)))
  .pipe(skipWhile(val => val == '{}'))

export function openUDPSteams(): void {
  /**
   * Create Observables
   */
  wallboxSocket$ = fromEvent(udp, 'message')
    .pipe(
      // Transform message array to object
      map(res => {
        return { message: res[0].toString(), rinfo: res[1] }
      }),
    )
    .pipe(
      // Transform response object-string to real JSON object
      map(v => {
        const _v = v
        if (_v.message.startsWith('{')) {
          _v.message = JSON.parse(_v.message)
        }
        return _v
      }),
    )
  /**
   * Subscribe to socket
   */
  wallboxSocket$.subscribe(val => {
    // Add newest messages to wallboxMap
    const { message } = val
    const key = message.Serial
    if (message.Serial) {
      delete message.Serial
      delete message.ID
      wallboxMap[key] = { ...wallboxMap[key], ...message }
    }
  })
}
