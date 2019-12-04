/// <reference types="node" />
import { Application } from 'express';
import MQTT from 'mqtt';
import * as dgram from 'dgram';
declare class App {
    app: Application;
    mqtt: MQTT.MqttClient;
    udp: dgram.Socket;
    store: any;
    constructor();
    private config;
    private initMQTT;
    private initStore;
    addDevice(): void;
    private routes;
}
export default App;
