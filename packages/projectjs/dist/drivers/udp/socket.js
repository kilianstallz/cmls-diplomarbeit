"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_handler_1 = require("../../handlers/udp/response.handler");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const app_1 = require("../../app");
exports.mountPollObervers = (socket) => {
    socket.on('listening', () => {
        rxjs_1.timer(0, app_1.appConfig.udp.pollIntervall)
            .pipe(operators_1.concatMap(() => rxjs_1.from(sendUDP(socket, 'report 2')))) // add more req to pipe with . stacking
            .pipe(operators_1.concatMap(() => rxjs_1.from(sendUDP(socket, 'report 3')))) // add more req to pipe with . stacking
            .subscribe({
            error: err => console.log(err),
        });
    });
    const udpMessage$ = rxjs_1.Observable.create(observer => {
        socket.on('message', (msg, rinfo) => {
            observer.next({ msg: msg.toString(), rinfo });
        });
    });
    udpMessage$.subscribe({
        next: ({ msg, rinfo }) => {
            console.log(`UDP: ${rinfo.address}:${rinfo.port} - size:${rinfo.size}`);
            udpHandler(msg);
        },
    });
};
function udpHandler(msg) {
    const conv = msg.toString();
    if (conv.startsWith('{')) {
        const parsed = JSON.parse(conv);
        response_handler_1.udpResponseHandler(parsed);
    }
    else {
        return conv;
    }
}
function sendUDP(socket, msg) {
    return new Promise((resolve, reject) => {
        app_1.appConfig.chargers.forEach(dev => {
            socket.send(msg, dev.port, dev.address, (err, bytes) => {
                if (err) {
                    console.error('Error Sending:', err);
                    reject(err);
                }
            });
            resolve();
        });
    });
}
//# sourceMappingURL=socket.js.map