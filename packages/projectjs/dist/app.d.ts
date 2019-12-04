/// <reference types="node" />
import { Application } from 'express';
import MQTT from 'mqtt';
import * as dgram from 'dgram';
import * as WebSocket from 'ws';
declare class App {
    app: Application;
    wss: WebSocket.Server;
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
