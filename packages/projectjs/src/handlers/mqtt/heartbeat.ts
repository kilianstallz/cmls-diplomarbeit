import { timer, from } from "rxjs"
import { concatMap } from "rxjs/operators"
import { UDPStore } from "../udp/response.handler"
import { mqtt, appConfig } from "../../app"

export const heartbeat = () => {
  timer(0, appConfig.mqtt.heartbeatIntervall || 10000).subscribe(() => {
    // Send a heartbeat of the current status in a certain intervall
    sendHeartbeat()
  })
}

/**
 * Sends a heartbeat of all or only one wallbox
 * @param serial Optional - Send a heartbeat of only one specific wallbox
 * @api public
 * @api mqtt - `/energie/wallboxStatus/:wallboxSerial`
 */
export const sendHeartbeat = (serial?: string) => {
  // Get value map
  const valueMap = UDPStore.get('valueMap')
  
  mqtt.publish(`energie/wallboxStatus`, JSON.stringify(valueMap))
  if (serial) {
    if (Object.keys(valueMap).includes(serial)) {
      const send = {
        serial,
        inUse: valueMap[serial].state === 3,
        powerOut: valueMap[serial].P
      }
      mqtt.publish(`energie/wallboxStatus/${serial}`, JSON.stringify(send))
      // Return
    }
  } else {
    Object.keys(valueMap).forEach(v => {
      const send = {
        serial: v,
        inUse: valueMap[v].state === 3,
        powerOut: valueMap[v].P
      }
      mqtt.publish(`energie/wallboxStatus/${v}`, JSON.stringify(send))
    })
    // Return
  }
}