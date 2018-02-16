import React, { Component } from 'react';
import Header from './Header.js';
import Websocket from './WebSocket.js';
import List from './List.js';
import BackgroundSwitcher from './BackgroundSwitcher.js';
import Error from './Error.js';
import ContentBlock from './ContentBlock.js'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      filter: '',
      socksMessage: '',
      sort: localStorage.getItem('sort') === null ? 'player' : localStorage.getItem('sort'),
      firebaseList: []
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

  firebaseCallback(data) {
    this.setState({
      firebaseList: data
    })
  }

  render() {
    return (
      <div id="bodyContent">
        <Websocket connectionString = "ws://127.0.0.1:13660/websession/" callback={this.socketCallback.bind(this)}/>
        <Header callback={this.filterCallback.bind(this)} sort={this.state.sort}
          sortCallback={this.sortCallback.bind(this)} firebaseCallback={this.firebaseCallback.bind(this)}/>
        <ContentBlock filter={this.state.filter} sort={this.state.sort} socksMessage={this.state.socksMessage} firebaseList={this.state.firebaseList}/>
        <Error />
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
