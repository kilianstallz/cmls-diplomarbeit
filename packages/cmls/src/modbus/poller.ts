import * as modbus from 'jsmodbus'
import { Socket } from 'net'
import { timer } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'
import { eventBus } from '../eventBus'

const socket = new Socket()
const modbusClient = new modbus.client.TCP(socket)

function readPVHoldingRegisters(from, to): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    modbusClient
      .readHoldingRegisters(from, to)
      .then(v => resolve(v.response.body.valuesAsBuffer))
      .catch(error => reject(error))
  })
}

export function modbusPVPoller(intervall): Promise<void> {
  return new Promise(resolve => {
    socket.connect(
      {
        host: '172.17.68.140',
        port: 502,
      },
      () => {
        console.log('Modbus Socket open')
        timer(0, intervall)
          .pipe(switchMap(() => readPVHoldingRegisters(499, 2)))
          .pipe(map((v: Buffer) => v.readInt32BE(0)))
          .pipe(
            map(v => {
              eventBus.emit('pvProductionCurrent', v)
            }),
          )
          .subscribe()

        timer(300, intervall)
          .pipe(switchMap(() => readPVHoldingRegisters(501, 4)))
          .pipe(map((v: Buffer) => Number(v.readBigInt64BE(0))))
          .pipe(
            map(v => {
              eventBus.emit('pvProductionDay', v)
            }),
          )
          .subscribe()

        console.log('Modbus Poller started')
        resolve()
      },
    )
  })
}

export default modbusClient
