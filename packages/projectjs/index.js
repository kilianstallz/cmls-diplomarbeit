import { Application, Poller, MQTTService, UDPService } from "chargejs";
import express from "express";
import * as http from 'http'
import { pubsub } from "./pubsub";

const app = express();
const server = http.createServer(app)
const io = require('socket.io')(server)

io.on('connection', () => {
  console.log('Client connected')
})

const charge = new Application();
const udp = new UDPService();
const mqtt = new MQTTService();
const main = new Poller(5000);

charge.init();

const startTime = Date.now()

let chargerConfig = {
  devices: [{address: '192.168.0.102', port: 7090}]
}

let deviceMap = {};
const init = async () => {
  // TODO: Get devices from memory config
  deviceMap = await pubsub.get("deviceMap");
  deviceMap = JSON.parse(deviceMap)
  if (!deviceMap) {
    deviceMap = {}
    chargerConfig.devices.forEach(v => {
      deviceMap[v.address] = {
        port: v.port
      }
    })
    pubsub.set("deviceMap", JSON.stringify(deviceMap));
  }

  // Health check stored devices
  chargerConfig.devices.forEach(d => {
      // TODO: DNS LOOKUP
      // Display `OK` on the device display
      udp.requestUDP({
        port: d.port,
        address: d.address,
        message: "display 0 0 0 0 OK"
      });
  });
};
init()

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
      time: Date.now() + process.uptime()
    }
  } else if(ID && ID === '3') {
    console.log(_msg)
  }
  deviceMap[data.rinfo.address] = newEntry
  io.emit('message', deviceMap)
})

main.cyclic(() => {
  // TODO: Get Devices from config
  // TODO: Get needed Data
  chargerConfig.devices.forEach(dev => {
    udp.requestUDP({
      port: dev.port,
      address: dev.address,
      message: "report 2"
    });
  })
  
  main.poll();
});
main.poll();

server.listen(3001);
