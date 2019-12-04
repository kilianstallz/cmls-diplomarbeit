"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = require("dgram");
const udpTest_handler_1 = require("../../handlers/udp/udpTest.handler");
class UDPSocket {
    constructor(port = 7090, test = false) {
        this.initSocket(port, test);
    }
    initSocket(port, test) {
        this.socket = dgram_1.createSocket('udp4');
        this.socket.bind(port);
        if (test) {
            udpTest_handler_1.testHandler(this.socket);
        }
    }
}
exports.UDPSocket = UDPSocket;
//# sourceMappingURL=initUDP.js.map