import { store, mqtt } from '../../server'
import { EventBusUdp } from '../../pubsub/events'

export function writeMap(data: any) {
  // Get the value Map
  let valueMap = store.get('valueMap') || {}
  // Get the stream map
  let streamMap = store.get('streamMap') || {}
  // Update the data of the current Wallbox with new data
  valueMap[data.serial] = { ...valueMap[data.serial], ...data, time: Date.now() }
  // Check is streammap is empty
  // then push the current data to the stream array
  if (!streamMap[data.serial]) {
    streamMap[data.serial] = []
    streamMap[data.serial].push({...data})
  } else {
    streamMap[data.serial].push({...data})
  }
  // Only keep the last 100 responses
  if(streamMap[data.serial].length > 100) {
    streamMap[data.serial].pop()
  }
  store.put('streamMap', streamMap)
  store.put('valueMap', valueMap)
  EventBusUdp.emit('value', valueMap)
}

/**
 * @param res Pass the parsed response Object from the udp observer
 * @description Parses the response object into a new format and
 */
export function udpResponseHandler(res: any) {
  switch (res.ID) {
    case '2':
      const { State, Error1, Error2, Plug, Setenergy, Output, Input } = res
      writeMap({
        serial: res['Serial'],
        state: State,
        error1: Error1,
        error2: Error2,
        plug: Plug,
        setEnergy: Setenergy,
        output: Output,
        input: Input,
        maxCurrent: res['Max curr'],
        maxCurrentPerc: res['Max curr %'],
        currentFS: res['Curr FS'],
        currentHW: res['Curr HW'],
        currentUser: res['Curr user'],
        tmoFS: res['Tmo FS'],
        tmoCT: res['Tmo CT'],
        currentTimer: res['Curr timer'],
      })
      break
    case '3':
      const { U1, U2, U3, I1, I2, I3, P, PF } = res
      writeMap({
        serial: res['Serial'],
        U1,
        U2,
        U3,
        I1,
        I2,
        I3,
        P,
        PF,
        ePres: res['E pres'],
        etotal: res['E total'],
      })
      break
  }
}
