import { timer, from, interval } from 'rxjs'
import { appConfig, udp as WallboxSocket } from '../app'
import { ApplicationConfig, Charger } from '../types/ApplicationConfig'
import { Socket } from 'dgram'
import { concatMap, map } from 'rxjs/operators'
import chalk from 'chalk'

/**
 * UDP Driver Function
 */

/**
 * Load Wallbox IPs
 */
export function loadCharger(): ApplicationConfig['chargers'] {
  return appConfig.chargers
}

/**
 * Wallbox Polling Timer
 * @description Als erstes werden die Konfigurierten IP-Adressen der Wallboxes geladen.
 * Über das `Array` an Wallboxes wird Itteriert und es werden nach der reihe alle benötigten Befehle abgefragt.
 */

// TODO: Optimize runtime
export function sendUDPPoll(socket: Socket, messages: string[], targets: Charger[]): Promise<void> {
  return new Promise((resolve, reject) => {
    messages.forEach(message => {
      targets.forEach(target => {
        setTimeout(() => {
          socket.send(message, target.port, target.address, (error, bytes) => {
            if (error) {
              reject(error)
            }
            resolve()
          })
        }, 100)
      })
    })
  })
}

export async function doWallboxPoll(): Promise<void> {
  const chargers = loadCharger()
  console.log('Lese Wallbox Daten...')
  return sendUDPPoll(WallboxSocket, ['report 1', 'report 2', 'report 3'], chargers)
}

export const startPoller = (conf: ApplicationConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    interval(conf.udp.pollIntervall)
      .pipe(map(() => doWallboxPoll()))
      .subscribe({
        error: err => console.log(chalk.red(err)),
      })
    resolve()
  })
}
