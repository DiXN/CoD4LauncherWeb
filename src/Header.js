import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SortIco from 'react-icons/lib/fa/sort'
import Firebase, { auth, provider } from './Firebase.js';
import {conTypes, conToBool} from './reducers/connection-reducer.js'
import {setConnection} from './actions/connection-action.js'
import { connect } from 'react-redux';
import store from './store.js';

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

        if(!conToBool(this.props.conState, conTypes.CONNECTED)) {
          store.dispatch(setConnection('connectionStatus', conTypes.ONLINE))
          document.querySelector('.spinner').style.display = 'block'
        }

        Firebase.database().ref(`Users/${this.state.user.uid}`).on('value', (snapshot) => {
          this.props.firebaseCallback(snapshot.val())
        })
      } else {
        setTimeout(() => {
          if(!conToBool(this.props.conState, conTypes.CONNECTED)) {
            store.dispatch(setConnection('connectionStatus', conTypes.OFFLINE))
            document.querySelector('.spinner').style.display = 'none'
          }

          this.props.firebaseCallback(null)
        }, 2000)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.socksMessage && nextProps.socksMessage.msg && nextProps.socksMessage.msg.PCName) {
        this.setState({
          status: `You are connected to CoD4Launcher on ${nextProps.socksMessage.msg.PCName}`
        })
      }

      if (nextProps.socksMessage && nextProps.socksMessage.msg && nextProps.socksMessage.msg.servers) {
        this.updateDB(nextProps.socksMessage.msg.servers)
      }
  }

  render() {
    return (
      <div className="top-container">
        <div id="topBlock">
          <div>
            <label>CoD4 Servers</label>
            {conToBool(this.props.conState, conTypes.CONNECTED) ?
            <div id="connectionCircle" className="tooltip" data-isUp="true" style={{backgroundColor: 'rgb(0, 110, 0)'}}>
              <span id="tooltip-text">{this.state.status}</span>
            </div>
            : conToBool(this.props.conState, conTypes.ONLINE) ?
            <div id="connectionCircle" className="tooltip" data-isUp="false" style={{backgroundColor: 'rgb(255, 138, 0)'}}>
              <span id="tooltip-text">You are online but not connected to CoD4Launcher, therefore only server refreshing works when signed in</span>
            </div>
            : conToBool(this.props.conState, conTypes.OFFLINE) ?
            <div id="connectionCircle" className="tooltip" data-isUp="false" style={{backgroundColor: 'rgb(255,70,0)'}}>
              <span id="tooltip-text">Could not connect to CoD4Launcher</span>
            </div> : null}
          </div>
          <div>
            <input type="text" placeholder="filter servers" onKeyUp={this.filterServer.bind(this)}/>
          </div>
        </div>
        <div className="sub-menu">
            {this.state.user ?
              <div className="login-container">
                <div style={{padding: '7px 50px'}} className="login-label">
                  <img src={this.state.user.photoURL} alt=''></img>
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
              {conToBool(this.props.conState, conTypes.CONNECTED) ? <div onClick={() => {this.setSort('ping')}}>ping</div> : null}
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

const mapStateToProps = (store) => {
  return {
    conState: store.connectionState,
    socksMessage: store.socksMessage
  }
}

export default connect(mapStateToProps)(Header)
