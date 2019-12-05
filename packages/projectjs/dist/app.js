"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mqtt_1 = __importDefault(require("mqtt"));
var bodyParser = __importStar(require("body-parser"));
var helmet_1 = __importDefault(require("helmet"));
var cors_1 = __importDefault(require("cors"));
var routes_1 = __importDefault(require("./api/routes"));
var mqtt_handler_1 = require("./pubsub/mqtt.handler");
var WebSocket = __importStar(require("ws"));
var node_storage_1 = __importDefault(require("node-storage"));
var App = /** @class */ (function () {
    function App() {
        this.app = express_1.default();
        this.wss = new WebSocket.Server({
            host: 'localhost',
            port: 3001,
            path: '/ws'
        });
        this.config();
        this.initMQTT();
        this.initStore();
        this.routes();
    }
    App.prototype.config = function () {
        // this.app.use(helmet())
        this.app.use(cors_1.default());
        this.app.use(helmet_1.default());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    };
    App.prototype.initMQTT = function () {
        this.mqtt = mqtt_1.default.connect();
        mqtt_handler_1.mqttHandler(this.mqtt);
        console.log(this.mqtt.options);
    };
    App.prototype.initStore = function () {
        this.store = new node_storage_1.default('../deviceConfig');
        var deviceConfig = this.store.get('deviceConfig');
        this.store.put('deviceConfig', deviceConfig);
    };
    App.prototype.addDevice = function () {
    };
    App.prototype.routes = function () {
        this.app.use('/', routes_1.default);
    };
    return App;
}());
exports.default = App;
//# sourceMappingURL=app.js.map