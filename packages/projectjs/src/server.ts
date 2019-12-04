import App from './app'
import { UDPSocket } from './drivers/udp/socket'

const {app, mqtt, store} = new App()
const PORT = process.env.PORT || 3000

/**
 * Initialize UDP Socket
 */
export const udpSocket = new UDPSocket(7090, store, true)
// const udp = udpSocket.socket
    
app.listen(PORT, () => {
    console.log('Express server listening on port', PORT)
})

export {
    app,
    mqtt,
    store
}