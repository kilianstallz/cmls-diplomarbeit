/**
 * Application entry file
 */

import { App } from './server'

console.log('Server startup...')
export const { appConfig, api, mqtt, udp } = new App()

// TODO: Rest Config in Config File
api.listen(3000, () => {
    console.log('API listening on port ' + 3000)
})
