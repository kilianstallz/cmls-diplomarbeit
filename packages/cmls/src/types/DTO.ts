import { WallboxStatus, Wallbox } from "./WallboxState";

export interface WallboxStatusChangedDTO {
    user: string | null
    type: string
    serial: string
    currTime: string
    oldStatus: WallboxStatus
    newStatus: WallboxStatus
}

export interface WallboxChargingDTO {
    user: string | null
    type: string
    serial: string
    currTime: string
    eSession: number
}

export interface WallboxFirstDataDTO {
    type: string
    serial: string
    map: Wallbox
}

export interface WallboxEnableDTO {
    type: string,
    serial: string,
    isEnabled: boolean
}