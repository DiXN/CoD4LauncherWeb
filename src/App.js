import React, { Component } from 'react';
import Header from './Header.js';
import Websocket from './WebSocket.js';
import List from './List.js';
import BackgroundSwitcher from './BackgroundSwitcher.js';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      filter: '',
      socksMessage: '',
      sort: localStorage.getItem('sort') === null ? 'player' : localStorage.getItem('sort')
    }
  }

  filterCallback(data) {
    this.setState({
      filter: data
    })
  }

  socketCallback(data) {
    this.setState({
      socksMessage: data
    })
  }

  sortCallback(data) {
    this.setState({
      sort: data
    })
  }

  render() {
    return (
      <div id="bodyContent">
        <Websocket connectionString = "ws://127.0.0.1:13660/websession/" callback={this.socketCallback.bind(this)}/>
        <Header callback={this.filterCallback.bind(this)} sort={this.state.sort} sortCallback={this.sortCallback.bind(this)} socksMessage={this.state.socksMessage}/>

        <div className="fadeIn" id="mainContentBlock">
          <List filter={this.state.filter} sort={this.state.sort} socksMessage={this.state.socksMessage}/>
        </div>

        <div className="error" id="errorBlock">
          Could not connect to CoD4Launcher. check if the application is running on the same PC as the website
          <br/>and make sure that port 13660 is not blocked by any other service.
          <p>
            Currently only Firefox, Chrome and Opera are fully supported.
            <br/>Although any Chromium or Mozilla based browser probably works.
          </p>
          When using Microsoft edge there is the possibility to "allow localhost loopback" in about:flags.
          <br/>However this is not a guarantee that connecting to the launcher works afterwards.
        </div>

        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>

        <div id="mpCircle" className="mapCircle center"/>
        <BackgroundSwitcher timeout={40000}/>
      </div>
    );
  }
}

export default App;
