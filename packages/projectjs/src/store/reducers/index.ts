import { SystemState } from '../../types/SystemState'
import { ADD_WALLBOX } from '../actions'

export const initialState: SystemState = {
  wallboxes: [],
}

export function wallboxReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_WALLBOX:
      const _boxes = state.wallboxes.unshift(action.data)
      return Object.assign({}, state, {
        wallboxes: _boxes,
      })
    default:
      return state
  }
}
