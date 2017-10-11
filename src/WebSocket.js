import { Component } from 'react';
import PropTypes from 'prop-types';

class Websocket extends Component {
  constructor(props) {
    super(props)
  }

  static socket = null

  retry() {
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
    ((sock) => {
      try { sock() }
      catch (err) { this.retry() }
    })(() => {
      let websocket = new WebSocket(this.props.connectionString)
      var connectionCircle = document.getElementById('connectionCircle')

      websocket.onopen = () => {
        Websocket.socket = websocket
        document.getElementById('errorBlock').style.display = 'none'
        connectionCircle.setAttribute('data-isUp', 'true')
        document.querySelector('.spinner').style.display = 'block'
      }

      websocket.onmessage = (msg) => {
        connectionCircle.style.backgroundColor = 'rgb(0,110,0)'
        this.sendToClients(JSON.parse(msg.data))
      }

      websocket.onclose = (e) => {
        this.retry()
      }
    })
  }

  componentDidMount() {
    this.setupWebsocket()
  }

  static send(msg) {
    if(Websocket.socket != null) {
      Websocket.socket.send(msg)

      const message = JSON.parse(msg)
      if (message.CONNECT != null) {
        console.log(`Connecting to server with ip: ${message.CONNECT}`);
      } else {
        console.log(msg)
      }
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
