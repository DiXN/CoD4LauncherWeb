import { Component } from 'react';
import PropTypes from 'prop-types';
import store from './store.js';
import {setConnection} from './actions/connection-action.js'
import {sendSockMessage} from './actions/socket-action.js'
import {conTypes} from './reducers/connection-reducer.js'

class Websocket extends Component {
  constructor(props) {
    super(props)

    this.firstRun = true
  }

  static socket = null

  retry() {
    setTimeout(() => {
      Websocket.socket = null
      this.setupWebsocket()
      store.dispatch(sendSockMessage({'CLOSED': 'Could not connect to CoD4Launcher'}))

      if(this.firstRun) {
        store.dispatch(setConnection('connectionStatus', conTypes.ONLINE))
        this.firstRun = false
      }
    }, this.firstRun ? 100 : 2000)
  }

  setupWebsocket() {
    ((sock) => {
      try { sock() }
      catch (err) { this.retry() }
    })(() => {
      let websocket = new WebSocket(this.props.connectionString)

      websocket.onopen = () => {
        Websocket.socket = websocket
        document.querySelector('.spinner').style.display = 'block'
        store.dispatch(setConnection('connectionStatus', conTypes.CONNECTED))
        this.firstRun = true
      }

      websocket.onmessage = (msg) => {
        store.dispatch(sendSockMessage(JSON.parse(msg.data)))
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
