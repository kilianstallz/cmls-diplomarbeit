import * as modbus from 'jsmodbus'
import chalk from 'chalk'
import { Socket } from 'net'
import { timer } from 'rxjs'
import { map, switchMap, delay } from 'rxjs/operators'
import { mqtt } from '../app'
const socket = new Socket()
const client = new modbus.client.TCP(socket)

export let pvCurrent$
export let pvToday$

function readPVHoldingRegister(from, to): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    client
      .readHoldingRegisters(from, to)
      .then(v => {
        resolve(v.response.body.valuesAsBuffer)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function mountModbusPVPoller(interval: number): Promise<void> {
  return new Promise(resolve => {
    pvCurrent$ = timer(0, interval)
      .pipe(switchMap(() => readPVHoldingRegister(499, 2)))
      .pipe(map(v => v.readInt32BE(0)))
      .pipe(map(v => ((v / 12) * 42).toString() + 'W'))
    pvToday$ = timer(10, interval * 100 + 10)
      .pipe(switchMap(() => readPVHoldingRegister(501, 4)))
      .pipe(map(v => Number(v.readBigInt64BE(0))))
      .pipe(map(v => ((v / 12) * 42).toString() + 'Wh'))

    resolve()
  })
}

export function connectModbus(): Promise<void> {
  return new Promise(resolve => {
    socket.connect(
      {
        host: '172.17.68.140',
        port: 502,
      },
      () => {
        console.log(chalk.green('PV Connected'))
        resolve()
      },
    )
  })
}
