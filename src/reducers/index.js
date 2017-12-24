import { combineReducers } from 'redux'
import connectionReducer from './connection-reducer'
import socketReducer from './socket-reducer'

const reducers = combineReducers({
  connectionState: connectionReducer,
  socksMessage: socketReducer
})

export default reducers