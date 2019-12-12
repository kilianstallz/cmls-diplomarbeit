/// <reference types="node" />
/**
 * Server
 * Hier werden alle Dienste, Handler und Driver initialisiert und gestartet.
 * Konfiguration der Express App.
 *

/**
 * Import App Modules
 */
import { Application } from 'express';
import { ApplicationConfig } from './types/ApplicationConfig';
import { EventEmitter } from 'events';
import { MqttClient } from 'mqtt';
import { Socket } from 'dgram';
/**
 * Expose App Class that starts the server an inizialises all components asynchronously
 */
export default class App extends EventEmitter {
    appConfig: ApplicationConfig;
    mqtt: MqttClient;
    udp: Socket;
    api: Application;
    constructor();
    /**
     * Load Config File
     */
    private loadRcFile;
    /**
     * Initialize MQTT and Handler
     */
    private initializeMQTT;
    /**
     * Initialize UDP Socket and Handler
     */
    private initializeUDP;
    /**
     * Initialize Express REST API
     */
    private initializeExpress;
}
