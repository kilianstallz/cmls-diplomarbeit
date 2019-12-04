/// <reference types="express" />
import { UDPSocket } from './drivers/udp/socket';
declare const app: import("express").Application, mqtt: import("mqtt").Client, store: any;
/**
 * Initialize UDP Socket
 */
export declare const udpSocket: UDPSocket;
export { app, mqtt, store };
