"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var socket_1 = require("./drivers/udp/socket");
var events_1 = require("./pubsub/events");
var _a = new app_1.default(), app = _a.app, mqtt = _a.mqtt, store = _a.store, wss = _a.wss;
exports.app = app;
exports.mqtt = mqtt;
exports.store = store;
var PORT = process.env.PORT || 3000;
/**
 * Initialize UDP Socket
 */
exports.udpSocket = new socket_1.UDPSocket(7090, store, false);
// const udp = udpSocket.socket
var lastEmit = null;
wss.on('connection', function (ws) {
    console.log('connected');
    ws.send('Connected');
});
events_1.EventBusUdp.on('value', function (event) {
    lastEmit = event;
    // Publish one topic for each device serial
    mqtt.publish('energie/lader', JSON.stringify(event));
    Object.keys(event).forEach(function (k) {
        mqtt.publish("energie/lader/" + k, JSON.stringify(event[k]));
    });
    wss.clients.forEach(function (client) {
        client.send(JSON.stringify(__assign(__assign({}, lastEmit), { time: Date.now() })));
    });
});
app.listen(PORT, function () {
    console.log('Express server listening on port', PORT);
});
//# sourceMappingURL=server.js.map