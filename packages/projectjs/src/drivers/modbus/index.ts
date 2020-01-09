import * as modbus from 'jsmodbus'
import chalk from 'chalk'
import { Socket } from 'net'
import { mqtt } from '../../app'
const socket = new Socket()
const client = new modbus.client.TCP(socket)

let prodDay: number, prodNow: number

export function connectModbus(deviceIP?: string, devicePort?: number): void {
  socket.connect(
    {
      host: '172.17.68.140',
      port: 502,
    },
    () => {
      console.log(chalk.green('Connected'))
      setInterval(() => {
        client
          .readHoldingRegisters(499, 2)
          .then(res => {
            const productionWatt = res.response.body.valuesAsBuffer.readUInt32BE(0)
            // console.log(chalk.blue('PV-Panel: ', productionWatt + 'W'))
            if (productionWatt > 1) {
              const print = Math.round((productionWatt / 12) * 52) // Hochrechnung auf 52 gleiche Module
              prodNow = print
              console.log(chalk.blue('PV-Produktion: ', print + 'W'))
            } else {
              console.log(chalk.blue('PV-Produktion: 0W'))
              prodNow = 0
            }
            const msg = JSON.stringify({productionNow: prodNow, time: Date.now()})
            mqtt.publish(
              'energie/solar/now',
              msg
            )
          })
          .catch(err => {
            console.log(chalk.red(err))
          })
        client.readHoldingRegisters(501, 4).then(res => {
          const productionWatt = res.response.body.valuesAsBuffer.readBigUInt64BE(0).toString()
          prodDay = parseInt(productionWatt)
          console.log(chalk.blue(`Produktion Heute: ${prodDay}Wh`))
          
          const msg = JSON.stringify({productionToday: prodDay, time: Date.now()})
          mqtt.publish(
            'energie/solar/today',
            msg
          )
        })
        // TODO: store values local in lowdb
        // TODO: Convert to rxjs
        const message = JSON.stringify({productionToday: prodDay, productionNow: prodNow, time: Date.now()})
          mqtt.publish(
            'energie/solar',
            message
          )
      }, 5000)
    },
  )
}
