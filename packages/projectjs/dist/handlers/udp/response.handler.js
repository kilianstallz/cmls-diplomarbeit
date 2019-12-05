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
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("../../server");
var events_1 = require("../../pubsub/events");
function writeMap(data) {
    // Get the value Map
    var valueMap = server_1.store.get('valueMap') || {};
    // Get the stream map
    var streamMap = server_1.store.get('streamMap') || {};
    // Update the data of the current Wallbox with new data
    valueMap[data.serial] = __assign(__assign(__assign({}, valueMap[data.serial]), data), { time: Date.now() });
    // Check is streammap is empty
    // then push the current data to the stream array
    if (!streamMap[data.serial]) {
        streamMap[data.serial] = [];
        streamMap[data.serial].push(__assign({}, data));
    }
    else {
        streamMap[data.serial].push(__assign({}, data));
    }
    // Only keep the last 100 responses
    if (streamMap[data.serial].length > 100) {
        streamMap[data.serial].pop();
    }
    server_1.store.put('streamMap', streamMap);
    server_1.store.put('valueMap', valueMap);
    events_1.EventBusUdp.emit('value', valueMap);
}
exports.writeMap = writeMap;
/**
 * @param res Pass the parsed response Object from the udp observer
 * @description Parses the response object into a new format and
 */
function udpResponseHandler(res) {
    switch (res.ID) {
        case '2':
            var State = res.State, Error1 = res.Error1, Error2 = res.Error2, Plug = res.Plug, Setenergy = res.Setenergy, Output = res.Output, Input = res.Input;
            writeMap({
                serial: res['Serial'],
                state: State,
                error1: Error1,
                error2: Error2,
                plug: Plug,
                setEnergy: Setenergy,
                output: Output,
                input: Input,
                maxCurrent: res['Max curr'],
                maxCurrentPerc: res['Max curr %'],
                currentFS: res['Curr FS'],
                currentHW: res['Curr HW'],
                currentUser: res['Curr user'],
                tmoFS: res['Tmo FS'],
                tmoCT: res['Tmo CT'],
                currentTimer: res['Curr timer'],
            });
            break;
        case '3':
            var U1 = res.U1, U2 = res.U2, U3 = res.U3, I1 = res.I1, I2 = res.I2, I3 = res.I3, P = res.P, PF = res.PF;
            writeMap({
                serial: res['Serial'],
                U1: U1,
                U2: U2,
                U3: U3,
                I1: I1,
                I2: I2,
                I3: I3,
                P: P,
                PF: PF,
                ePres: res['E pres'],
                etotal: res['E total'],
            });
            break;
    }
}
exports.udpResponseHandler = udpResponseHandler;
//# sourceMappingURL=response.handler.js.map