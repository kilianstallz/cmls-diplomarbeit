import { WallboxStatus, Wallbox } from "./WallboxState";

export interface WallboxStatusChangedDTO {
    type: string
    serial: string
    oldStatus: WallboxStatus
    newStatus: WallboxStatus
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