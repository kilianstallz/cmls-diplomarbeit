/**
 * Application entry file
 */
/// <reference types="node" />
/// <reference types="express" />
declare const udp: import("dgram").Socket, api: import("express").Application, appConfig: import("./types/ApplicationConfig").ApplicationConfig, mqtt: import("mqtt").Client;
export { udp, api, appConfig, mqtt };
