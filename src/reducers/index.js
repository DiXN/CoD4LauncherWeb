import { combineReducers } from 'redux'
import connectionReducer from './connection-reducer'

const reducers = combineReducers({
    connectionState: connectionReducer
})

export default reducers