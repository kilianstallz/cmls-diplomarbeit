import * as modbus from 'jsmodbus'
import { Socket } from 'net'
const socket = new Socket()
const client = new modbus.client.TCP(socket)

export function connectModbus(deviceIP?: string, devicePort?: number): void {
  socket.connect(
    {
      host: '192.168.250.181',
      port: 502,
    },
    () => {
      console.log('Connected')
      setInterval(() => {
        client
          .readHoldingRegisters(499, 2)
          .then(res => {
            const productionWatt = res.response.body.valuesAsBuffer.readUInt32BE(0)
            if (productionWatt > 1) {
              const print = Math.round((productionWatt / 12) * 52) // Hochrechnung auf 52 gleiche Module
              console.log('PV-Produktion: ', print + 'W')
            } else {
              console.log('PV-Produktion: ', productionWatt + 'W')
            }
          })
          .catch(err => {
            console.log(err)
          })
      }, 5000)
    },
  )
}
