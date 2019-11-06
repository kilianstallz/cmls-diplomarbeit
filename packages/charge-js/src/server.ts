import express from 'express'
import * as mqtt from 'mqtt'
import * as dgram from 'dgram'
import { Poller } from './polling'

// Initialize App
const app = express()
const mqttClient = mqtt.connect()
const udp = dgram.createSocket('udp4')
udp.bind(7090)

// Express
app.get('/', (req, res) => {
  res.send('Server active')
})

// UDP Startup
udp.on('listening', () => {
  console.log('\nUDP Socket listening on port ' + 7090)
})

// Send test message
udp.send('UDP STARTUP POSITIVE', 7090, 'localhost')

// Message Listener
udp.on('message', (msg, rinfo) => {
  console.log(`UDP from ${rinfo.address}:${rinfo.port} - ${msg.toString()}`)
})

// MQTT Connection Listener
mqttClient.on('connect', () => {
  console.log('MQTT Client connected')
})

// Send and Subscribe to startup topic
mqttClient.subscribe('startup', error => {
  if (!error) {
    mqttClient.publish('startup', 'POSITIVE')
  }
})

// mqtt message listener
mqttClient.on('message', (topic, msg) => {
  console.log(topic, msg.toString())
})

// Main Loop
const poller = new Poller(5000)
poller.onPoll(() => {
  console.log('Polling...')
  // Get devices
  // // Get UDP Devices
  // // Get Modbus Devices
  // Check device health
  // // Check UDP Devices
  // // Check ModbusDevices
  // Check charger status
  // // Get Chargin status/Auth user
  // Process PV Data
  // // Get current production
  // Calculate Price
  // Publish to Broker
  poller.poll()
})
poller.poll()

// Start Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

process.on('SIGINT', () => {
  console.log('Shutting down all services....')
  mqttClient.removeAllListeners()
  udp.close()
  process.exit()
})
