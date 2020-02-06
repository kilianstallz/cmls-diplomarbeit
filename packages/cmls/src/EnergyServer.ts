import express from 'express'
import socketio from 'socket.io'
import { createServer, Server } from 'http'
import { createSocket, Socket } from 'dgram'
import cors from 'cors'

export class EnergyServer {
    public static readonly PORT: number = 5000
    private static readonly UDPPORT: number = 7090
    private _app: express.Application
    private server: Server
    private io: socketio.Server
    private udpSocket: Socket
    private port: string | number

    constructor () {
        this._app = express()
        this.port = process.env.PORT || EnergyServer.PORT
        this._app.use(cors())
        this._app.options('*', cors())
        this.server = createServer(this._app)
        this.initSocket()
        this.initUDP()
        this.listen()
    }

    private initSocket (): void {
        this.io = socketio(this.server)
    }

    private initUDP (): void {
        this.udpSocket = createSocket('udp4')
        this.udpSocket.bind(EnergyServer.UDPPORT)
    }

    private listen (): void {
        this.server.listen(this.port, () => {
            console.log(`HTTP Server running on port ${this.port}`)
        })
    }


    get app (): express.Application {
        return this._app
    }

    get udp (): Socket {
        return this.udpSocket
    }

}
