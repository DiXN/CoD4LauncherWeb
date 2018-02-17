const socketReducer = (state = {id: Math.random(), msg: {init: 'init'}}, action) => {
    switch(action.type) {
      case 'SEND_MESSAGE':
        return {...state, ...{id: Math.random(), msg: action.msg}}
      default:
        return {...state, ...{id: Math.random(), msg: action.msg}}
    }

    return state
  }

  export default socketReducer