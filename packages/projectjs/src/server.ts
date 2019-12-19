/**
 * Server
 * Hier werden alle Dienste, Handler und Driver initialisiert und gestartet.
 * Konfiguration der Express App.
 *

/**
 * Import App Modules
 */
import express, { Application } from 'express'
import { rcFile } from 'rc-config-loader'
import { ApplicationConfig } from './types/ApplicationConfig'
import { defaultConfig } from './config/default'
import { EventEmitter } from 'events'
import { MqttClient, connect } from 'mqtt'
import { Socket, createSocket } from 'dgram'
import { mqttHandler } from './handlers/mqtt'
import { mountPollObervers } from './drivers/udp/socket'
import routes from './api/routes'
import { connectModbus } from './drivers/modbus'

/**
 * Expose App Class that starts the server an inizialises all components asynchronously
 */
export default class App extends EventEmitter {
  public appConfig: ApplicationConfig
  public mqtt: MqttClient
  public udp: Socket
  public api: Application

  constructor() {
    super()
    this.loadRcFile()
    this.initializeExpress()
    this.initializeMQTT()
    this.initializeUDP()
    this.initializeModbus()
  }

  /**
   * Load Config File
   */
  private loadRcFile() {
    try {
      const results = rcFile('charge', {
        defaultExtension: '.js',
      })
      if (!results) {
        return (this.appConfig = defaultConfig)
      }
      return (this.appConfig = results.config as ApplicationConfig)
    } catch (error) {
      this.appConfig = defaultConfig
    }
  }

  /**
   * Initialize MQTT and Handler
   */
  private initializeMQTT() {
    this.mqtt = connect(this.appConfig.mqtt.brokerUrl, this.appConfig.mqtt.options)
    console.log(`MQTT connected on ${this.mqtt.options.host}:${this.mqtt.options.port}`)
    // Mount mqtt handler
    mqttHandler(this.mqtt)
  }

  /**
   * Initialize UDP Socket and Handler
   */
  private initializeUDP() {
    this.udp = createSocket('udp4')
    this.udp.bind(this.appConfig.udp.port, () => {
      console.log('UDP Socket bound to ' + this.appConfig.udp.port)
    })
    mountPollObervers(this.udp)
  }

  /**
   * Initialize Express REST API
   */
  private initializeExpress() {
    this.api = express()
    // TODO: Server Config
    this.api.use(routes)
  }

  private initializeModbus() {
    connectModbus()
  }

  // TODO: WSS
}
