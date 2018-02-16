import { createStore } from 'redux'
import reducers from './reducers'

if (typeof window === 'undefined') {
  global.window = {}
}

const preloadedState = window.__PRELOADED_STATE__

delete window.__PRELOADED_STATE__

const store = createStore(reducers, preloadedState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export default store