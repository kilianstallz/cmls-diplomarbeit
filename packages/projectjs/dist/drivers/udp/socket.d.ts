/// <reference types="node" />
import { Socket } from 'dgram';
export declare class UDPSocket {
    private store;
    socket: Socket;
    deviceConfig: any;
    constructor(port: number, store: any, test?: boolean);
    private initSocket;
    /**
     * Create and call pollers and observers on the udp message listener
     * @param intervall The polling intervall
     */
    private mountPollObervers;
    /**
     * First Instance of message handling
     * response: Sent to `udpResponseHandler`
     * status/error: Sent to `udpErrorHandler`
     */
    private udpHandler;
    /**
     * Send the request to the provided IP Addresses
     */
    private sendUDP;
}
