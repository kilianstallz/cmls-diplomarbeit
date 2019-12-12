import { ServerOptions } from "ws";
import { IClientOptions } from "mqtt";
export interface ApplicationConfig {
    websocket?: {
        options?: ServerOptions;
    };
    udp: {
        address?: string;
        port: number;
        pollIntervall: number;
    };
    mqtt?: {
        options?: IClientOptions;
        brokerUrl: any;
    };
    chargers: [{
        address: string;
        port: number;
    }];
}
