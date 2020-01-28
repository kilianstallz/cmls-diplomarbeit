export interface Wallbox {
  serial?: string
  isEnabled?: boolean
  status?: WallboxStatus
  maxCurrent?: number // Max current in `mA` 0;6000-32000
  maxCurrentHW?: number // Max current supported by car hardware
  setEnergy?: number // energy value in `0.1Wh` - 0;1-999999999
  U1?: number
  U2?: number
  U3?: number
  I1?: number // in mA
  I2?: number
  I3?: number // ^detto
  P?: number // `mW` Effective Power
  PF?: number // Cos phi in `0.1%`
  eSession?: number // energy transfered by the current session in `0.1Wh`
}

export enum WallboxStatus {
  isCharging = 'isCharging',
  isWaiting = 'isPluggedNotCharging',
  isIdle = 'isIdle',
  isError = 'isError',
}
