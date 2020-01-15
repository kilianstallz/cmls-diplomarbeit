/**
 * Application entry file
 */

import App from './server'
import { mountMqttPublisher } from './publisher/mqtt'
import { startPoller } from './drivers/udp'
import { openUDPSteams } from './streams/udp'
import { connectModbus } from './drivers/modbus'

const app = new App()

const { udp, api, appConfig, mqtt } = app

/**
 * Start UDP
 */
startPoller(appConfig)
openUDPSteams()

connectModbus()
/**
 * Start MQTT
 */
mountMqttPublisher(mqtt, 10000)

export { udp, api, appConfig, mqtt }
