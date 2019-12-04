import App from './app'
import { UDPSocket } from './drivers/udp/socket'
import { EventBusUdp } from './pubsub/events'

const {app, mqtt, store, wss} = new App()
const PORT = process.env.PORT || 3000

/**
 * Initialize UDP Socket
 */
export const udpSocket = new UDPSocket(7090, store, true)
// const udp = udpSocket.socket

let lastEmit = null

wss.on('connection', ws => {
    console.log('connected')
    ws.send('Connected')
})

EventBusUdp.on('value', event => {
    lastEmit = event
    // Publish one topic for each device serial
    mqtt.publish('energie/lader', JSON.stringify(event))
    Object.keys(event).forEach(k => {
        mqtt.publish(`energie/lader/${k}`, JSON.stringify(event[k]))
    })

    wss.clients.forEach(client => {
        client.send(JSON.stringify({...lastEmit, time: Date.now()}))
    })
})

    
app.listen(PORT, () => {
    console.log('Express server listening on port', PORT)
})

export {
    app,
    mqtt,
    store
}