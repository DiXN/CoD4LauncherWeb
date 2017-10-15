export const conTypes = {
  OFFLINE : 'OFFLINE',
  ONLINE: 'ONLINE',
  CONNECTED : 'CONNECTED'
}

export const conToBool = (con, type) => con === type

const connectionReducer = (state = conTypes.ONLINE, action) => {
  switch(action.type) {
    case conTypes.OFFLINE:
      return conTypes.OFFLINE
    case conTypes.ONLINE:
      return conTypes.ONLINE
    case conTypes.CONNECTED:
      return conTypes.CONNECTED    
    default:
      break
  }

  return state
}

export default connectionReducer