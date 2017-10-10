import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SortIco from 'react-icons/lib/fa/sort'
import Firebase, { auth, provider } from './Firebase.js';

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: 'trying to establish connection with CoD4 Launcher',
      user: null
    }
  }

  filterServer = (e) => {
    this.props.callback(e.target.value.toLowerCase())
  }

  setSort = (sort) => {
    this.setState({sort: sort})
    localStorage.setItem('sort', sort)
    this.props.sortCallback(sort)
  }

  updateDB = (lst) => {
    if(this.state.user != null) {
      Firebase.database().ref(`Users/${this.state.user.uid}`).update({
        servers: lst.map((x) => { return {IPorName: x.IPorName, IP: x.IP}})
      })
    }
  }

  login = () => {
    auth.signInWithPopup(provider)
    .then((result) => {
      this.setState({
        user : result.user
      })
    })
  }

  logout = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null
      })
    })
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })

        Firebase.database().ref(`Users/${this.state.user.uid}`).on('value', (snapshot) => {
          this.props.firebaseCallback(snapshot.val())
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.socksMessage.PCName !== undefined && nextProps.socksMessage.PCName !== this.state.status) {
        this.setState({
          status: `You are connected to CoD4Launcher on ${nextProps.socksMessage.PCName}`
        })
      }

      if (nextProps.socksMessage.CLOSED !== undefined && nextProps.socksMessage.CLOSED !== this.state.status) {
        this.setState({
          status: nextProps.socksMessage.CLOSED
        })
      }

      if (nextProps.socksMessage.servers != null && nextProps.socksMessage.servers !== this.state.list) {
        this.updateDB(nextProps.socksMessage.servers)
      }
  }

  render() {
    return (
      <div className="top-container">
        <div id="topBlock">
          <div>
            <label>CoD4 Servers</label>
            <div id="connectionCircle" className="tooltip" data-isUp="false">
              <span id="tooltip-text">{this.state.status}</span>
            </div>
          </div>
          <div>
            <input type="text" placeholder="filter servers" onKeyUp={this.filterServer.bind(this)}/>
          </div>
        </div>
        <div className="sub-menu">
            {this.state.user ?
              <div className="login-container">
                <div style={{padding: '7px 50px'}} className="login-label">
                  <img src={this.state.user.photoURL}></img>
                  <span>{this.state.user.displayName}</span>
                </div>
                <div className="login-menu">
                  <div onClick={() => {this.logout()}}>logout</div>
                </div>
              </div>
              : <div className="login-container">
                  <div className="label" onClick={() => {this.login()}}>login</div>
                </div>
            }
          <div className="sort-container">
            <div className="sort-label"><SortIco/><span>{this.props.sort}</span></div>
            <div className="sort-menu">
              <div onClick={() => {this.setSort('ping')}}>ping</div>
              <div onClick={() => {this.setSort('player')}}>player</div>
              <div onClick={() => {this.setSort('name')}}>name</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Header.PropTypes = {
  callback: PropTypes.func,
  sortCallback: PropTypes.func
}

export default Header;
