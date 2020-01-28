import { Wallbox } from '../../types/Wallbox'

export const ADD_WALLBOX = 'ADD_WALLBOX'
export const TOGGLE_WALLBOX = 'TOGGLE_WALLBOX'

export const addWallbox = (wallbox: Wallbox) => ({
  type: ADD_WALLBOX,
  data: wallbox,
})

export const toggleWallbox = (serial: string) => ({
  type: TOGGLE_WALLBOX,
  serial,
})
