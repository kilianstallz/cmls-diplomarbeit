"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dgram_1 = require("dgram");
var udpTest_handler_1 = require("../../handlers/udp/udpTest.handler");
var response_handler_1 = require("../../handlers/udp/response.handler");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var UDPSocket = /** @class */ (function () {
    function UDPSocket(port, store, test) {
        if (port === void 0) { port = 7090; }
        if (test === void 0) { test = false; }
        this.store = store;
        this.initSocket(port, test);
        this.mountPollObervers();
    }
    // Create the socket and bind to the client port
    UDPSocket.prototype.initSocket = function (port, test) {
        if (port === void 0) { port = 7090; }
        if (test === void 0) { test = false; }
        this.socket = dgram_1.createSocket('udp4');
        this.socket.bind(port);
        if (test) {
            udpTest_handler_1.testHandler(this.socket);
        }
        var fromStore = this.store.get('deviceConfig');
        if (fromStore) {
            this.deviceConfig = fromStore;
        }
        else {
            this.deviceConfig = [];
        }
    };
    /**
     * Create and call pollers and observers on the udp message listener
     * @param intervall The polling intervall
     */
    UDPSocket.prototype.mountPollObervers = function (intervall) {
        var _this = this;
        if (intervall === void 0) { intervall = 5000; }
        // Create a poller with timer function
        this.socket.on('listening', function () {
            rxjs_1.timer(0, intervall)
                .pipe(operators_1.concatMap(function () { return rxjs_1.from(_this.sendUDP('report 2')); })) // add more req to pipe with . stacking
                .pipe(operators_1.concatMap(function () { return rxjs_1.from(_this.sendUDP('report 3')); })) // add more req to pipe with . stacking
                .subscribe({
                error: function (err) { return console.log(err); },
            });
        });
        var udpMessage$ = rxjs_1.Observable.create(function (observer) {
            _this.socket.on('message', function (msg, rinfo) {
                observer.next({ msg: msg.toString(), rinfo: rinfo });
            });
        });
        udpMessage$.subscribe({
            next: function (_a) {
                var msg = _a.msg, rinfo = _a.rinfo;
                console.log("UDP: " + rinfo.address + ":" + rinfo.port + " - size:" + rinfo.size);
                _this.udpHandler(msg);
            },
        });
    };
    /**
     * First Instance of message handling
     * response: Sent to `udpResponseHandler`
     * status/error: Sent to `udpErrorHandler`
     */
    UDPSocket.prototype.udpHandler = function (msg) {
        var conv = msg.toString();
        if (conv.startsWith('{')) {
            var parsed = JSON.parse(conv);
            response_handler_1.udpResponseHandler(parsed);
        }
        else {
            return conv;
        }
    };
    /**
     * Send the request to the provided IP Addresses
     */
    UDPSocket.prototype.sendUDP = function (msg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.deviceConfig.forEach(function (dev) {
                _this.socket.send(msg, dev.port, dev.address, function (err, bytes) {
                    if (err) {
                        console.error('Error Sending:', err);
                    }
                });
                resolve();
            });
        });
    };
    return UDPSocket;
}());
exports.UDPSocket = UDPSocket;
//# sourceMappingURL=socket.js.map