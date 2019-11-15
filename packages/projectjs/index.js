import { Application, Poller, MQTTService, UDPService } from "chargejs";
import express from "express";
import WebSocket from 'ws'
import * as http from 'http'
import { pubsub } from "./pubsub";

const app = express();
const server = http.createServer(app)
const wss = new WebSocket.Server({server})

const charge = new Application();
const udp = new UDPService();
const mqtt = new MQTTService();
const main = new Poller(5000);

charge.init();

let deviceMap = {};
const init = async () => {
  // TODO: Get devices from memory config
  deviceMap = await pubsub.get("deviceMap");
  deviceMap = JSON.parse(deviceMap)
  if (!deviceMap) {
    deviceMap = {
      "192.168.0.102": {
        port: 7090
      }
    };
    pubsub.set("deviceMap", JSON.stringify(deviceMap));
  }

  // Health check stored devices
  Object.keys(deviceMap).forEach(d => {
      // TODO: DNS LOOKUP
      // Display `OK` on the device display
      udp.requestUDP({
        port: deviceMap[d].port,
        address: d,
        message: "display 0 0 0 0 OK"
      });
  });
};
init()

wss.on('connection', (ws) => {
  ws.send('Connected!')
})

udp.on('udpMessage', (data) => {
  const _msg = data.msg
  let newEntry = {}
  const {Serial, ID, Sec} = _msg
  if(ID && ID === '2') {
    const {State, Error1, Error2, Plug, AuthON, Output} = _msg
    newEntry = {
      ...deviceMap[data.rinfo.address],
      currentState: {
        State, Error1, Error2, Plug, AuthON, Output,
        MaxCurr: _msg['Max curr'],
        MaxCurrPerc: _msg['Max curr %'],
        TmoFS: _msg['Tmo FS'],
        TmoCT: _msg['Tmo CT'],
        CurrTimer: _msg['Curr timer'],
        Setenergy: _msg['Setenergy'],
      },
      Serial,
      Sec,
    }
  }
  deviceMap[data.rinfo.address] = newEntry
  wss.clients.forEach(client => {
    if(client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({...deviceMap, time: Date.now()}))
    }
  })
})

main.cyclic(() => {
  // TODO: Get Devices from config
  // TODO: Get needed Data

  // Main loop
  udp.requestUDP({
    port: 7090,
    address: "192.168.0.102",
    message: "report 2"
  });

  wss.clients.forEach(client => {
    if(client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({...deviceMap, time: Date.now()}))
    }
  })

  main.poll();
});
main.poll();

server.listen(3001);
