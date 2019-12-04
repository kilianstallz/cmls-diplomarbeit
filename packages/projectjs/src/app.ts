import express, { Application } from 'express'
import MQTT from 'mqtt'
import * as bodyParser from 'body-parser'
import * as http from 'http'
import * as dgram from 'dgram'
import helmet from 'helmet'
import cors from 'cors'
import routes from './api/routes'
import { mqttHandler } from './pubsub/mqtt.handler'
import LocalStorage from 'node-storage'

class App {
    public app: Application
    // public server: http.Server
    public mqtt: MQTT.MqttClient
    public udp: dgram.Socket
    public store

    constructor() {
        this.app = express()
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
        this.mqtt = MQTT.connect()
        mqttHandler(this.mqtt)
    }

    private initStore(): void {
        this.store = new LocalStorage('../deviceConfig')
        const deviceConfig = [
            {address: 'localhost', port: 7090},
        ]
        this.store.put('deviceConfig', deviceConfig)
    }

    public addDevice(): void {

    }

    private routes(): void {
        this.app.use('/', routes)
    }
}

export default App
