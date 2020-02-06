import express from 'express'
import socketio from 'socket.io'
import { createServer, Server } from 'http'
import { createSocket, Socket } from 'dgram'
import cors from 'cors'
import { EventEmitter } from 'events'
import 'reflect-metadata'
import { LoggerService } from './logger/logger.service'
import { MqttClient, connect } from 'mqtt'

export class EnergyServer extends EventEmitter {
    public static readonly PORT: number = 5000
    private static readonly UDPPORT: number = 7090
    private _app: express.Application
    private _mqtt: MqttClient
    private server: Server
    private io: socketio.Server
    private udpSocket: Socket
    private port: string | number

    constructor (
    ) {
        super()
        this._app = express()
        this.port = process.env.PORT || EnergyServer.PORT
        this._app.use(cors())
        this._app.options('*', cors())
        this.server = createServer(this._app)
        this.initSocket()
        this.initUDP()
        this.initMQTT()
        this.listen()
    }

    private initSocket (): void {
        this.io = socketio(this.server)
    }

    private initUDP (): void {
        this.udpSocket = createSocket('udp4')
        this.udpSocket.bind(EnergyServer.UDPPORT)
    }

    private initMQTT(): void {
        this._mqtt = connect('mqtt://docker.htl-wels.at', {
            port: 1883,
            username: 'energieHTL',
            password: 'NiceWeather',
            protocol: 'mqtt'
        })
    }

    private listen (): void {
        this.server.listen(this.port, () => {
            LoggerService.print(`HTTP Server listening on port ${this.port}`, 'green', '[server]')
        })
    }


    get app (): express.Application {
        return this._app
    }

    get udp (): Socket {
        return this.udpSocket
    }

    get mqtt (): MqttClient {
        return this._mqtt
    }

}
