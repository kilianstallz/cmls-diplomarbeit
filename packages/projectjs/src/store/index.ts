import { createStore } from 'redux'
import { wallboxReducer } from './reducers'

const store = createStore(wallboxReducer)

export default store
