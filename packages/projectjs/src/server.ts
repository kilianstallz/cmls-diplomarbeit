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
// import routes from './api/routes'
import { connectModbus } from './drivers/modbus'
import chalk from 'chalk'

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
  }

  /**
   * Load Config File
   */
  private loadRcFile(): void {
    try {
      const results = rcFile('charge', {
        defaultExtension: '.js',
      })
      if (!results) {
        this.appConfig = defaultConfig
      }
      this.appConfig = results.config as ApplicationConfig
    } catch (error) {
      throw new Error('Fehler beim laden der Konfigurationsdatei')
    }
  }

  /**
   * Initialize UDP Socket and Handler
   */
  private initializeUDP(): void {
    this.udp = createSocket('udp4')
    this.udp.bind(this.appConfig.udp.port, () => {
      console.log(chalk.green('UDP Socket bound to ' + this.appConfig.udp.port))
    })
  }

  /**
   * Initialize MQTT and Handler
   */
  private initializeMQTT(): void {
    this.mqtt = connect(this.appConfig.mqtt.brokerUrl, this.appConfig.mqtt.options)
    console.log(chalk.green(`MQTT connected on ${this.mqtt.options.host}:${this.mqtt.options.port}`))
    // Mount mqtt handler
    // mqttHandler(this.mqtt)
  }

  /**
   * Initialize Express REST API
   */
  private initializeExpress(): void {
    this.api = express()
    // TODO: Server Config
    // this.api.use(routes)
  }
  // TODO: WSS
}
