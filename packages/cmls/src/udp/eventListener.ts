import { Wallbox, WallboxStatus } from "../types/WallboxState";
import { UDP_NEW_MESSAGE } from "../types/eventTypes";
import { eventBus } from "../eventBus";
import mqtt from '../mqtt'
import { WallboxStatusChangedDTO, WallboxFirstDataDTO, WallboxEnableDTO } from "../types/DTO";

// other listeners
import './wallboxErrors'

function calcState({state, plug}): WallboxStatus {
    if ((state === 1 && plug === 3) || (state === 0 && plug === 0)) {
        return WallboxStatus.isIdle
    } else if (state === 2 && plug === 7) {
        return WallboxStatus.isWaiting
    } else if (state === 3 && plug === 7) {
        return WallboxStatus.isCharging
    } else {
        return WallboxStatus.isError
    }
}

function _transformUDPMessage(message: string): Wallbox {
    const parsed = JSON.parse(message)
    let data: Wallbox = {}
    if (parsed.ID === 1 || parsed.ID === '1') {
        data.serial = parsed.Serial
    }
    if (parsed.ID === 2 || parsed.ID === '2') {
        // Get wallbox status
        data.serial = parsed.Serial
        data.status = calcState({ state: parsed.State, plug: parsed.Plug })
        data.isEnabled = parsed["Enable user"] === 1 ? true : false

        // look for errors
        if (parsed.Error1 !== 0 || parsed.Error2 !== 0) {
            eventBus.emit('wallboxError', {
                serial: parsed.Serial,
                error1: parsed.Error1,
                error2: parsed.Error2,
                dataAttached: parsed
            })
        }
    }
    if (parsed.ID === 3 || parsed.ID === '3') {
        data.serial = parsed.Serial
        data.I1 = parsed.I1        
        data.I2 = parsed.I2        
        data.I3 = parsed.I3                
        data.U1 = parsed.U1                
        data.U2 = parsed.U2                
        data.U3 = parsed.U3                
        data.P = parsed.P                
        data.PF = parsed.PF                
        data.eSession = parsed["E pres"]                
    }
    // Skip unparsed message
    return data
}
let dataMap = {}

function _detectChangeAndEmit (prevMap, newMap, serial: string) {
    const _currentMap = prevMap[serial] as Wallbox
    const _newMap = newMap[serial] as Wallbox
    if (!_currentMap) { // First Ever send update
        console.log(`${serial} - First Update`)
        const msg = {
            type: 'FIRST_UPDATE',
            serial,
            map: _newMap
        } as WallboxFirstDataDTO
        eventBus.emit('wallboxFirstData', msg)
        mqtt.publish('energie/wallbox/statusChange', JSON.stringify(msg))
        // Status goes from idle to waiting -> someone has plugged in
    } else if (_currentMap.status === WallboxStatus.isIdle && _newMap.status === WallboxStatus.isWaiting) {
        eventBus.emit('carPluggedIn', {
            serial: _newMap.serial
        })
        console.log(`${serial} - User Plugged in`)
        const msg = {
            type: 'CAR_PLUGGED_IN',
            serial,
            newStatus: _newMap.status,
            oldStatus: _currentMap.status
        } as WallboxStatusChangedDTO
        mqtt.publish('energie/wallbox/statusChange', JSON.stringify(msg))
        // Wallbox wird aktiviert oder deaktiviert
    } else if (_currentMap.isEnabled !== _newMap.isEnabled) {
        console.log(`${serial} - Wallbox enabled`)
        const msg: WallboxEnableDTO = {
            type: 'WALLBOX_ENABLE_CHANGE',
            isEnabled: _newMap.isEnabled,
            serial
        }
        eventBus.emit('wallboxEnableChange', msg)
        mqtt.publish('energie/wallbox/statusChange', JSON.stringify(msg))
    }
}

export function mountUDPEventListener() {
    eventBus.on('UDP', data => {
        const _prevMap = Object.assign({}, dataMap)
        switch(data.type) {
            case UDP_NEW_MESSAGE:
                if(data.isData && data.message) {
                    const trans = _transformUDPMessage(data.message)
                    // console.log(trans.serial)
                    if (!trans.serial) {
                        console.log('trans undef', trans)
                    } else {
                        dataMap[trans.serial] = Object.keys(dataMap).includes(trans.serial) ? {...dataMap[trans.serial], ...trans} : {...trans}
                        _detectChangeAndEmit(_prevMap, dataMap, trans.serial)
                        console.log(dataMap)
                        eventBus.emit('wallboxDataChange', dataMap)
                    }
                    // react on state change
                }
            }
        })
}