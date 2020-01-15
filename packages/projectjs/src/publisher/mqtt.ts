import { wallboxMap$ } from '../streams/udp'
import { MqttClient } from 'mqtt'
import { timer } from 'rxjs'

/**
 * Mount all publishers for mqtt data transfer
 */
export function mountMqttPublisher(mqtt: MqttClient, interval: number): void {
  /**
   * Wallboxes
   */
  // Publish to MQTT because observable returns string already
  let _fullWallboxMap // Store data localy for publishing
  wallboxMap$.subscribe(mapString => (_fullWallboxMap = mapString)) // Only publish the newest data
  timer(interval).subscribe(() => mqtt.publish('energie/wallboxMap', _fullWallboxMap)) // Publish map every interval-time

  /**
   * PV Anlage
   */
}
