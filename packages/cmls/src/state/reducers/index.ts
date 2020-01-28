import { GlobalState } from "../../types/GlobalState";

const initialState = {
    '19237584': {
        enabled: false,
        user: null,
        isCharging: false,
    },
    '19231281': {
        enabled: false,
        user: null,
        isCharging: false,
    }
}

export function appState(state = initialState, action) {
    switch(action.type) {
        default:
            return state
    }
}
