/**
 * Application entry file
 */

import App from './server'
import { mountMqttPublisher } from './publisher/mqtt'
import { startPoller } from './drivers/udp'
import { openUDPSteams, toggleWallbox } from './streams/udp'
import { connectModbus, mountModbusPVPoller, pvCurrent$, pvToday$ } from './drivers/modbus'
import chalk from 'chalk'

// Server Startup
const app = new App()
const { udp, api, appConfig, mqtt } = app

/**
 * Start Streams and Drivers
 */
// Wallbox Poller
async function Startup(): Promise<void> {
  try {
    await startPoller(appConfig)
    await openUDPSteams()
    await connectModbus()
    await mountModbusPVPoller(5000)
    pvCurrent$.subscribe({
      next: c => console.log(chalk.blue('Produkion jetzt: ', c)),
      error: e => console.log(e),
    })
    pvToday$.subscribe({
      next: c => console.log(chalk.blue('Produktion heute: ', c)),
      error: e => console.log(e),
    })
    await mountMqttPublisher(mqtt, 10000)
  } catch (error) {
    throw error
  }
}

Startup()
toggleWallbox('19231281', true)

export { udp, api, appConfig, mqtt }
