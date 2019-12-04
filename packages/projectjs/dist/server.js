"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var socket_1 = require("./drivers/udp/socket");
var events_1 = require("./pubsub/events");
var _a = new app_1.default(), app = _a.app, mqtt = _a.mqtt, store = _a.store;
exports.app = app;
exports.mqtt = mqtt;
exports.store = store;
var PORT = process.env.PORT || 3000;
/**
 * Initialize UDP Socket
 */
exports.udpSocket = new socket_1.UDPSocket(7090, store, true);
// const udp = udpSocket.socket
events_1.EventBusUdp.on('value', function (event) {
    // Publish one topic for each device serial
    mqtt.publish('energie/lader', JSON.stringify(event));
    Object.keys(event).forEach(function (k) {
        mqtt.publish("energie/lader/" + k, JSON.stringify(event[k]));
    });
});
app.listen(PORT, function () {
    console.log('Express server listening on port', PORT);
});
//# sourceMappingURL=server.js.map