import { ApplicationConfig } from "../types/ApplicationConfig";

export const defaultConfig = {
  mqtt: {
    brokerUrl: 'mqtt://docker.htl-wels.at',
  },
  udp: {
    address: 'localhost',
    port: 7090
  }
} as ApplicationConfig