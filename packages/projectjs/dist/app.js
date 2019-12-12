"use strict";
/**
 * Application entry file
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const app = new server_1.default();
const { udp, api, appConfig, mqtt } = app;
exports.udp = udp;
exports.api = api;
exports.appConfig = appConfig;
exports.mqtt = mqtt;
//# sourceMappingURL=app.js.map