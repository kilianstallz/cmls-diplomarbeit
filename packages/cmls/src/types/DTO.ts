import { WallboxStatus, Wallbox } from "./WallboxState";

interface EventTransaction {
    currTime: string
    serial: string
    type: string
}

export interface WallboxStatusChangedDTO extends EventTransaction {
    user: string | null
    oldStatus: WallboxStatus
    newStatus: WallboxStatus
}

export interface WallboxChargingDTO extends EventTransaction {
    user: string | null
    isCharging: true
    powerW: number
    eSession: number
}

export interface WallboxFirstDataDTO extends EventTransaction {
    map: Wallbox
}

export interface WallboxEnableDTO extends EventTransaction {
    isEnabled: boolean
}