import { createStore } from 'redux'
import { appState } from './reducers'

const store = createStore(appState)

export default store