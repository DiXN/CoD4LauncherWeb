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
        }

        Firebase.database().ref(`Users/${this.state.user.uid}`).on('value', (snapshot) => {
          this.props.firebaseCallback(snapshot.val())
        })
      } else {
        setTimeout(() => {
          if(!conToBool(this.props.conState, conTypes.CONNECTED)) {
            store.dispatch(setConnection('connectionStatus', conTypes.OFFLINE))
          }
  
          this.props.firebaseCallback(null)
        }, 1000)
      }
    })
  }

  setStatusLabel = (state) => { 
    switch (state) { 
      case conTypes.ONLINE: 
        this.setState({ 
          status: 'You are online but not connected to CoD4Launcher, therefore only server refreshing works when signed in' 
        }) 
        break; 
      case conTypes.OFFLINE:  
        this.setState({ 
          status: 'Could not connect to CoD4Launcher' 
        }) 
        break; 
      default: 
        break; 
    } 
  } 

  componentWillReceiveProps(nextProps) {
      if (nextProps.socksMessage.PCName != null) {
        this.setState({
          status: `You are connected to CoD4Launcher on ${nextProps.socksMessage.PCName}`
        })
      }

      if(nextProps.conState != null) { 
        this.setStatusLabel(nextProps.conState) 
      } 

      if (nextProps.socksMessage.servers != null) {
        this.updateDB(nextProps.socksMessage.servers)
        this.setState({
          isConnected: true
        })
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
              {this.state.isConnected ? <div onClick={() => {this.setSort('ping')}}>ping</div> : null}
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
    conState: store.connectionState 
  } 
} 
 
export default connect(mapStateToProps)(Header) 
