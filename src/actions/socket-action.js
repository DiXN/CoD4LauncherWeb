
export const sendSockMessage = (sockMessage, type) => {
  switch (type) {
    case 'SEND_MESSAGE':
      return {
        type: 'SEND_MESSAGE',
        msg: sockMessage
      }
    default:
      return {
        type: 'SEND_MESSAGE',
        msg: sockMessage
      }
  }
}