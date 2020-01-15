import * as modbus from 'jsmodbus'
import chalk from 'chalk'
import { Socket } from 'net'
import { timer, from, interval } from 'rxjs'
import { map } from 'rxjs/operators'
import { mqtt } from '../app'
const socket = new Socket()
const client = new modbus.client.TCP(socket)

function mountModbusPVPoller(): void {
  const pvCurrentProd$ = interval(5000)
    .pipe(() => from(client.readHoldingRegisters(499, 2)))
    .pipe(map(v => v.response.body.valuesAsBuffer.readUInt32BE(0).toString()))
  const pvTodayProd$ = interval(5000)
    .pipe(() => from(client.readHoldingRegisters(501, 4)))
    .pipe(map(v => v.response.body.valuesAsBuffer.readBigUInt64BE(0).toString()))

  pvCurrentProd$.subscribe(val => {
    console.log(chalk.blue('PV Aktuell: ', val))
    mqtt.publish('energie/solar/current', val)
  })
  pvTodayProd$.subscribe(val => {
    console.log(chalk.blue('PV Aktuell: ', val))
    mqtt.publish('energie/solar/today', val)
  })
}

export function connectModbus(): void {
  socket.connect(
    {
      host: '172.17.68.140',
      port: 502,
    },
    () => {
      console.log(chalk.green('PV Connected'))
      mountModbusPVPoller()
    },
  )
}
