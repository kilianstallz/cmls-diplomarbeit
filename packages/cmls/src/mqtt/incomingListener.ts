import { MqttClient } from "mqtt";
import { eventBus } from "../eventBus";

export class QIncomingEventHandler {
    client: MqttClient
    constructor(
        client: MqttClient
    ) {
        this.client = client
        this.client.subscribe('energie/tankenLogin')
        this.client.subscribe('energie/tankenInterrupt')
        this.mountListener()
    }

    mountListener() {
        this.client.on('message', (topic, payload) => {
            switch (topic) {
                case 'energie/tankenLogin':
                    // TODO: Store USERid and Serial to DB and store
                    eventBus.emit('sendUDP', {
                        address: '', // TODO: GET IP by serial from store,
                        port: 7080,
                        messsage: 'ena 1'
                    })
                    break
                case 'energie/tankenInterrupt':
                    eventBus.emit('sendUDP', {
                        address: '',
                        port: 7080,
                        message: 'ena 0'
                    })
                    break;
                default:
                    break;
            }
        })
    }
}