import mqtt from 'mqtt'
import { eventBus } from '../eventBus'
import { QIncomingEventHandler } from './incomingListener'

const client = mqtt.connect('mqtt://docker.htl-wels.at', {
    port: 1883,
    username: 'energieHTL',
    password: 'NiceWeather',
    protocol: 'mqtt'
})

const incomingEventHandler = new QIncomingEventHandler(client)


export default client