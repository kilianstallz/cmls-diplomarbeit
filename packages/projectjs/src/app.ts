import express, { Application } from 'express'
import MQTT from 'mqtt'
import * as bodyParser from 'body-parser'
import * as http from 'http'
import * as dgram from 'dgram'
import helmet from 'helmet'
import cors from 'cors'
import routes from './api/routes'
import { mqttHandler } from './pubsub/mqtt.handler'
import * as WebSocket from 'ws'
import LocalStorage from 'node-storage'

class App {
    public app: Application
    public wss: WebSocket.Server
    // public server: http.Server
    public mqtt: MQTT.MqttClient
    public udp: dgram.Socket
    public store

    constructor() {
        this.app = express()
        this.wss = new WebSocket.Server({
            host: 'localhost',
            port: 3001,
            path: '/ws'
        })
        this.config()
        this.initMQTT()
        this.initStore()
        this.routes()
    }

    private config(): void {
        // this.app.use(helmet())
        this.app.use(cors())
        this.app.use(helmet())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: false}))
    }

    private initMQTT(): void {
        this.mqtt = MQTT.connect('mqtt://docker.htl-wels.at', {
            port: 1883,
            username: 'energieHTL',
            password: 'niceWeather',
            protocol: 'mqtt'
        })
        this.mqtt.on('message', (topic, msg) => {
            console.log(topic, msg)
        })
        this.mqtt.subscribe('energie/presence', () => {
            this.mqtt.publish('energie/presence', 'TEST')
            this.mqtt.unsubscribe('energie/presence')
        })
        mqttHandler(this.mqtt)
    }

    private initStore(): void {
        this.store = new LocalStorage('../deviceConfig')
        const deviceConfig = this.store.get('deviceConfig')
        this.store.put('deviceConfig', deviceConfig)
    }

    public addDevice(): void {

    }

    private routes(): void {
        this.app.use('/', routes)
    }
}

export default App
