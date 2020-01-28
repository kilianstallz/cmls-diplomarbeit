export interface Wallbox {
  serial: string
  address: string
  port: number
  // Zeigt ob die Wallbox ein oder aus ist, entspricht `sysEna`
  isEnabled: boolean
  status: WallboxStatus
  powerData: WallboxPowerData
  error: Error
}

export enum WallboxStatus {
  isCharging,
  isWaiting,
  isIdle,
  isError,
}

export interface WallboxPowerData {
  U1: number
  U2: number
  U3: number
  I1: number
  I2: number
  I3: number
  P: number
  PF: number
}
