import { Component } from 'react';
import PropTypes from 'prop-types';

class Websocket extends Component {
  constructor(props) {
    super(props)
  }

  static socket = null

  displayErrorMessage() {
    var connectionCircle = document.getElementById('connectionCircle')
    connectionCircle.style.backgroundColor = 'rgb(255,70,0)'
    console.log('Socket is closed. Reconnect will be attempted in 2 seconds')
    document.querySelector('.error').style.display = 'block'
    connectionCircle.setAttribute('data-isUp', 'false')
    document.querySelector('.spinner').style.display = 'none'
    document.querySelector('#mainContentBlock').style.display = 'none'

    setTimeout(() => {
      Websocket.socket = null
      this.setupWebsocket()
      this.sendToClients({'CLOSED': 'Could not connect to CoD4Launcher'})
    }, 2000)
  }

  sendToClients(msg) {
    this.props.callback((msg))
  }

  setupWebsocket() {
    let websocket = new WebSocket(this.props.connectionString)

    websocket.onopen = () => {
      Websocket.socket = websocket
      var connectionCircle = document.getElementById('connectionCircle')
      connectionCircle.style.backgroundColor = 'rgb(0,110,0)'
      document.getElementById('errorBlock').style.display = 'none'
      connectionCircle.setAttribute('data-isUp', 'true')
      document.querySelector('.spinner').style.display = 'block'
    }

    websocket.onmessage = (msg) => {
      this.sendToClients(JSON.parse(msg.data))
    }

    websocket.onclose = (e) => {
      this.displayErrorMessage()
    }
  }

  componentDidMount() {
    this.setupWebsocket()
  }

  static send(msg) {
    if(Websocket.socket != null) {
      Websocket.socket.send(msg)
      console.log(msg)
    }
  }

  render() {
    return null;
  }
}

Websocket.PropTypes = {
  callback: PropTypes.func
}

export default Websocket;