import { wallboxMap$ } from '../streams/udp'
import { MqttClient } from 'mqtt'
import { pvToday$, pvCurrent$ } from '../drivers/modbus'
import { map, delayWhen, skipWhile } from 'rxjs/operators'
import { timer } from 'rxjs'

export function _detectStatusChange(currentStatus: any, newStatus: any): any {
  if (currentStatus.state !== newStatus.state) {
    return true
  }
  return {}
}

/**
 * Mount all publishers for mqtt data transfer
 */
export function mountMqttPublisher(mqtt: MqttClient, interval: number): Promise<void> {
  return new Promise(resolve => {
    /**
     * Wallboxes
     */
    // Publish to MQTT because observable returns string already
    let _fullWallboxMap // Store data localy for publishing
    wallboxMap$.subscribe(mapString => {
      _fullWallboxMap = JSON.parse(mapString)
      mqtt.publish('energie/wallboxMap', JSON.stringify(_fullWallboxMap))
    }) // Only publish the newest data

    /**
     * Publish ChargerStatus Change
     */
    const statusMap = new Object() // stores current state and plugged values
    wallboxMap$.pipe(map(v => JSON.parse(v))).subscribe(v => {
      for (const chargerSerial in v) {
        const currentStatus = statusMap[chargerSerial]
        const newData = v[chargerSerial]
        const newStatus = Object({ plug: newData.Plug, state: newData.State })
        // Only push when data has changed
        if (currentStatus) {
          if (newStatus.plug !== currentStatus.plug || newStatus.state !== currentStatus.state) {
            statusMap[chargerSerial] = newStatus
            mqtt.publish('energie/wallboxStatus', JSON.stringify(statusMap))
          }
        } else {
          statusMap[chargerSerial] = newStatus
        }
      }
    })
    // DO heartbeat all 100 seconds
    timer(0, 100000).subscribe({
      next: () => mqtt.publish('energie/wallboxStatus', JSON.stringify(statusMap)),
    })

    /**
     * PV Anlage
     */
    pvCurrent$.subscribe(val => mqtt.publish('energie/solar/current', val))
    pvToday$.subscribe(val => mqtt.publish('energie/solar/today', val))
    resolve()
  })
}
