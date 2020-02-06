import { Wallbox, WallboxStatus } from "../types/WallboxState";
import { UDP_NEW_MESSAGE, WALLBOX_FIRST_DATA, WALLBOX_ENABLE_CHANGE, CAR_PLUGGED_IN, CAR_PLUGGED_OUT, CAR_PLUGGED_OUT_CHARGING, CAR_STARTED_CHARGING } from "../types/eventTypes";
import { eventBus } from "../eventBus";
import { mqtt } from '../app'
import { WallboxStatusChangedDTO, WallboxFirstDataDTO, WallboxEnableDTO, WallboxChargingDTO } from "../types/DTO";

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
    // console.log(parsed)
    if (parsed.ID === 1 || parsed.ID === '1') {
        data.serial = parsed.Serial
        // console.log(parsed)
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
        data.eSession = parsed["E pres"]/10          
    }
    // Skip unparsed message
    return data
}
let dataMap = {}

/**
 * Main UDP Reducer detects changes in the map and emits values based on change
 */
function _detectChangeAndEmit (prevMap, newMap, serial: string) {
    const _currentMap = <Wallbox>prevMap[serial]
    const _newMap = <Wallbox>newMap[serial]
    
    /**
     * EVENTS
     */

    // First Ever send update
    if (!_currentMap) { 
        console.log(`${serial} - First Update`)
        const msg = {
            type: 'FIRST_UPDATE',
            serial,
            map: _newMap
        } as WallboxFirstDataDTO
        eventBus.emit(WALLBOX_FIRST_DATA, msg)
        mqtt.publish('energie/tanken/events', JSON.stringify(msg))
        return
    }

    // Wallbox Enabled/Disabled
    if (_currentMap.isEnabled !== _newMap.isEnabled) {
        console.log(`${serial} - Wallbox ${_newMap.isEnabled ? 'enabled' : 'disabled'}`)
        const msg: WallboxEnableDTO = {
            type: 'WALLBOX_ACTIVE',
            isEnabled: _newMap.isEnabled,
            serial,
            currTime: new Date().toUTCString()    
        }
        eventBus.emit(WALLBOX_ENABLE_CHANGE, msg)
        mqtt.publish('energie/tanken/events', JSON.stringify(msg))
    }

    // Status goes from idle to waiting -> someone has plugged in
    if (_currentMap.status === WallboxStatus.isIdle && _newMap.status === WallboxStatus.isWaiting) {
        eventBus.emit(CAR_PLUGGED_IN, {
            serial: _newMap.serial
        })
        console.log(`${serial} - User Plugged in`)
        const msg = {
            type: CAR_PLUGGED_IN,
            serial,
            newStatus: _newMap.status,
            oldStatus: _currentMap.status,
            currTime: new Date().toUTCString()
        } as WallboxStatusChangedDTO
        mqtt.publish('energie/tanken/events', JSON.stringify(msg))
    }
    // From waiting to idle -> someone plugged car out after charging or before charging has begun
    if (_currentMap.status === WallboxStatus.isWaiting && _newMap.status === WallboxStatus.isIdle) {
        eventBus.emit(CAR_PLUGGED_OUT, {
            serial: _newMap.serial
        })
        console.log(`${serial} - User Plugged out`)
        const msg = {
            type: CAR_PLUGGED_OUT,
            serial,
            newStatus: _newMap.status,
            oldStatus: _currentMap.status,
            currTime: new Date().toUTCString()
        } as WallboxStatusChangedDTO
        mqtt.publish('energie/tanken/events', JSON.stringify(msg))
    }
    // Status goes from chargin to idle -> someone has plugged out while charging
    if (_currentMap.status === WallboxStatus.isCharging && _newMap.status === WallboxStatus.isIdle) {
        eventBus.emit(CAR_PLUGGED_OUT, {
            serial: _newMap.serial
        })
        eventBus.emit(CAR_PLUGGED_OUT_CHARGING, {
            serial: _newMap.serial,
            eSessionCount: _newMap.eSession
        })
        console.log(`${serial} - User Plugged out while charging`)
        const msg = {
            type: CAR_PLUGGED_OUT_CHARGING,
            serial,
            newStatus: _newMap.status,
            oldStatus: _currentMap.status,
            currTime: new Date().toUTCString()
        } as WallboxStatusChangedDTO
        mqtt.publish('energie/tanken/events', JSON.stringify(msg))
    }

    // Status goes from waiting to chargin -> charging has begun
    if (_currentMap.status === WallboxStatus.isWaiting && _newMap.status === WallboxStatus.isCharging) {
        eventBus.emit(CAR_STARTED_CHARGING, {
            serial: _newMap.serial
        })
        console.log(`${serial} - Car started charging`)
        const msg = {
            type: CAR_STARTED_CHARGING,
            serial,
            newStatus: _newMap.status,
            oldStatus: _currentMap.status,
            currTime: new Date().toUTCString()
        } as WallboxStatusChangedDTO
        mqtt.publish('energie/tanken/status', JSON.stringify(msg))
    }

    /**
     * STATUS
     */
    // Send data when vehicle is charging
    if (_newMap.status === WallboxStatus.isCharging) {
        const msg = {
            type: 'CHARGING_STATUS',
            user: null, // TODO: GET USER ID
            isCharging: true,
            powerW: _newMap.P/100,
            serial: _newMap.serial,
            eSession: _newMap.eSession,
            currTime: new Date().toUTCString()
        } as WallboxChargingDTO
        mqtt.publish('energie/tanken/status', JSON.stringify(msg))
    }
}

export function mountUDPEventListener() {
    eventBus.on(UDP_NEW_MESSAGE, data => {
        const _prevMap = Object.assign({}, dataMap)
        if(data.isData && data.message) {
            const trans = _transformUDPMessage(data.message)
            // console.log(trans.serial)
            if (!trans.serial) {
                console.log('Undefined Transfer', trans)
            } else {
                dataMap[trans.serial] = Object.keys(dataMap).includes(trans.serial) ? {...dataMap[trans.serial], ...trans} : {...trans}
                _detectChangeAndEmit(_prevMap, dataMap, trans.serial)
                // console.log(dataMap)
                eventBus.emit('wallboxDataChange', dataMap)
            }
            // react on state change
        }
    })
}