import mqtt from 'mqtt'
import { eventBus } from '../eventBus'

const client = mqtt.connect('mqtt://docker.htl-wels.at', {
    port: 1883,
    username: 'energieHTL',
    password: 'NiceWeather',
    protocol: 'mqtt'
})

export default client