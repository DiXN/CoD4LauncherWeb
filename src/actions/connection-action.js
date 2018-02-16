import {conTypes} from '../reducers/connection-reducer'

export const setConnection = (connectionStatus, type) => {
  switch (type) {
    case conTypes.ONLINE:
      return {
        type: 'ONLINE',
        connectionStatus
      }
    case conTypes.OFFLINE:
      return {
        type: 'OFFLINE',
        connectionStatus
      }
    case conTypes.CONNECTED:
      return {
        type: 'CONNECTED',
        connectionStatus
      }
    default:
      return {
        type: 'OFFLINE',
        connectionStatus
      }
  }
}