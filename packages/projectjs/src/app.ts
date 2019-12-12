/**
 * Application entry file
 */

import App from './server'
import { heartbeat } from './handlers/mqtt/heartbeat'

const app = new App()

const { udp, api, appConfig, mqtt } = app

heartbeat()

export {
    udp,
    api,
    appConfig,
    mqtt
}