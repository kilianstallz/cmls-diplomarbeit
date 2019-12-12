"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Server
 * Hier werden alle Dienste, Handler und Driver initialisiert und gestartet.
 * Konfiguration der Express App.
 *

/**
 * Import App Modules
 */
const express_1 = __importDefault(require("express"));
const rc_config_loader_1 = require("rc-config-loader");
const default_1 = require("./config/default");
const events_1 = require("events");
const mqtt_1 = require("mqtt");
const dgram_1 = require("dgram");
const mqtt_2 = require("./handlers/mqtt");
const socket_1 = require("./drivers/udp/socket");
const routes_1 = __importDefault(require("./api/routes"));
/**
 * Expose App Class that starts the server an inizialises all components asynchronously
 */
class App extends events_1.EventEmitter {
    constructor() {
        super();
        this.loadRcFile();
        this.initializeExpress();
        this.initializeMQTT();
        this.initializeUDP();
    }
    /**
     * Load Config File
     */
    loadRcFile() {
        try {
            const results = rc_config_loader_1.rcFile('charge', {
                defaultExtension: '.js',
            });
            if (!results) {
                return this.appConfig = default_1.defaultConfig;
            }
            return this.appConfig = results.config;
        }
        catch (error) {
            this.appConfig = default_1.defaultConfig;
        }
    }
    /**
     * Initialize MQTT and Handler
     */
    initializeMQTT() {
        this.mqtt = mqtt_1.connect(this.appConfig.mqtt.brokerUrl, this.appConfig.mqtt.options);
        console.log(`MQTT connected on ${this.mqtt.options.host}:${this.mqtt.options.port}`);
        // Mount mqtt handler
        mqtt_2.mqttHandler(this.mqtt);
    }
    /**
     * Initialize UDP Socket and Handler
     */
    initializeUDP() {
        this.udp = dgram_1.createSocket('udp4');
        this.udp.bind(this.appConfig.udp.port, () => {
            console.log('UDP Socket bound to ' + this.appConfig.udp.port);
        });
        socket_1.mountPollObervers(this.udp);
    }
    /**
     * Initialize Express REST API
     */
    initializeExpress() {
        this.api = express_1.default();
        // TODO: Server Config
        this.api.use(routes_1.default);
    }
}
exports.default = App;
//# sourceMappingURL=server.js.map