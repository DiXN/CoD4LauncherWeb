import React, { Component } from 'react';
import Modal from './Modal.js';
import Websocket from './WebSocket.js';
import {TransitionMotion, spring, presets} from 'react-motion';
import store from './store.js';
import {setConnection} from './actions/connection-action.js'
import {conTypes, conToBool} from './reducers/connection-reducer.js'
import { connect } from 'react-redux';

class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [],
      isOpen: false,
      item: null,
      IpOrName: '',
      isConnected: false
    }

    this.isRunning = false
  }

  lengthCheck = () => {
    if(this.state.list.length >= 12) {
      document.querySelector('#mainContentBlock').classList.add('smallContentBlock')
    } else {
      document.querySelector('#mainContentBlock').classList.remove('smallContentBlock')
    }
  }

  fetchServers = (nextProps)  => {
    const displayError = () => {
      if(nextProps && !conToBool(nextProps.conState, conTypes.CONNECTED)) {
        console.log('server DOWN or not logged in!')
        document.querySelector('.spinner').style.display = 'none'
        store.dispatch(setConnection('connectionStatus', conTypes.OFFFLINE))
      }

      this.isRunning = false
    }

    const fetchServer = (endpoint) => {
      Promise.all(this.props.firebaseList.servers.map((x) => {
        return fetch(`${endpoint}/ip/${x.IP}`).then((response) => {
          return response.json()
        }).then((output) => {
          if(output.status !== 'DOWN') {
            return {
              IP:             x.IP,
              IPorName:       x.IPorName,
              Status:         output.status,
              CurrentPlayers: output.numplayers,
              MaxPlayers:     output.sv_maxclients,
              Map:            output.mapname,
              ServerName:     output.sv_hostname,
              ListOfPlayers:  output.list_of_players,
            }
          } else {
            return {
              IP:             x.IP,
              IPorName:       x.IPorName,
              Status:         output.status,
              CurrentPlayers: '-1',
            }
          }
        })
      })).then((response) => {
        document.querySelector('.spinner').style.display = 'none'
        store.dispatch(setConnection('connectionStatus', conTypes.ONLINE))

        this.setState({
          list: response,
          item: response.find((elem) => elem != null ? elem.IPorName === this.state.IpOrName : false),
          isConnected: false
        }, () => {
          this.lengthCheck()
          this.isRunning = false
        })
      }).catch(() => {
        displayError()
      })
    }

    ((endpoints, retries) => {
      this.isRunning = true
      const checkEndpoints = (endpoints, retries) => {
        if (endpoints.length === 0) {
          if(retries === 0) {
            return displayError()
          } else {
            setTimeout(() => {
              return checkEndpoints(endpoints, retries - 1)
            }, 750)
          }
        } else {
          const [x, ...xs] = endpoints
          fetch(`${x}/ip/`).then((res) => {
            if(this.props.firebaseList && this.props.firebaseList.servers) {
              return fetchServer(x)
            } else {
              checkEndpoints(xs, retries)
            }
          }).catch(() => {
            return checkEndpoints(xs, retries)
          })
        }
      }

      checkEndpoints(endpoints, retries)
    })(['http://mknasx.myds.me:3000', 'http://mknas:3000'], 2)
  }

  componentDidMount() {
    this.fetchServers(null)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.socksMessage.servers != null && nextProps.socksMessage.servers !== this.state.list) {
      document.querySelector('.spinner').style.display = 'none'

      this.setState({
        list: nextProps.socksMessage.servers,
        isConnected: true,
        item: nextProps.socksMessage.servers.find((elem) => elem != null ? elem.IPorName === this.state.IpOrName : false)
      }, () => {
        this.lengthCheck()
      })
    }

    if (this.props.sockMessage.msg && this.props.sockMessage.msg.CLOSED != null && !this.isRunning) {
      this.fetchServers(nextProps)
    }
}

  getMapImage(map, e) {
    if(!e) e = window.event

    if(e.shiftKey) {
      import(`./img/maps/${map}.jpg`)
      .then(mapImage => {
        var circle = document.querySelector('.mapCircle')
        circle.classList.add('mapCircleHover')
        circle.style.backgroundImage = `url("${mapImage}")`
      })
      .catch(err => {
        console.log(`can not find ${map}.jpg`)
      });
    }
  }

  handleServerClick(ip) {
    Websocket.send(JSON.stringify({"CONNECT": ip}))
  }

  handleRightClick(e, item) {
    if (e) {
      e.preventDefault()
    }

    this.setState({
      IpOrName: item.IPorName,
      item: item
    });

    this.toggleModal()
  }

  toggleModal() {
    const open = this.state.isOpen

    if (open) {
      document.querySelector('.top-container').style.zIndex = 1
    } else {
      document.querySelector('.top-container').style.zIndex = 0
    }

    this.setState({
      isOpen: !open
    });
  }

  getDefaultStyles = () => {
    return this.state.list.map((li, i) => ({data: li, key: i.toString(), style: {paddingTop: 0, paddingBottom: 0, height: 0, opacity: 0.88}}))
  }

  getStyles = (a, b) => {
    const getSortType = (a, b) => {
      const sort = this.props.sort

      if (sort === 'player') {
        return b.CurrentPlayers - a.CurrentPlayers
      } else if(sort === 'ping') {
        return a.Ping - b.Ping
      } else if (sort === 'name') {
        return b.ServerName - a.ServerName
      }
    }

    return this.state.list.filter((elem) => elem != null).filter((elem) => elem.ServerName
      != null ? elem.ServerName.toLowerCase().indexOf(this.props.filter) > -1 : elem.IPorName.
        toLowerCase().indexOf(this.props.filter) > -1).sort((a, b) => getSortType(a, b)).map((item, key) => {
      return {
        data: item,
        key: key.toString(),
        style: {
          height: spring(64, presets.gentle),
          paddingTop: spring(19.5, presets.gentle),
          paddingBottom: spring(19.5, presets.gentle),
          opacity: spring(0.88, presets.gentle),
        }
      }
    })
  }

  willEnter() {
    return {
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      opacity: 0.88
    }
  }

  willLeave() {
    return {
      height: spring(0, presets.wobbly),
      paddingTop: spring(0),
      paddingBottom: spring(0),
      opacity: spring(0, presets.wobbly)
    }
  }

  render() {
    const contructListElement = (key, style, li) => {
      const maxPlayers = li.MaxPlayers
      const curPlayers = li.CurrentPlayers
      const status = li.Status
      let className = 'liContentRed'

      if (status !== 'DOWN') {
        if(maxPlayers - curPlayers >= 3) {
          className = 'liContentGreen'
        } else if (maxPlayers - curPlayers === 0) {
          className = 'liContentRed'
        } else if (maxPlayers - curPlayers <= 2){
          className = 'liContentOrange'
        } else {
          return <li className='liContentRed' key={key}>{li.IPorName} is DOWN</li>
        }

        return(
          <li className={className} key={key} style={style} onContextMenu={(e) => this.handleRightClick(e, li)}
            onClick={() => {this.state.isConnected ? this.handleServerClick(li.IP) : this.handleRightClick(null, li)}} onMouseOver={(e) => {this.getMapImage(li.Map, e)}}
              onMouseOut={() => {document.querySelector('.mapCircle').classList.remove('mapCircleHover')}}>
            <div className='flexParent'>
              <div className='liTitleDiv'>{li.ServerName}</div>
              <div className='statsDiv'>
                <div className='playerDiv'>{li.CurrentPlayers}/{li.MaxPlayers}</div>
                {this.state.isConnected ? <div className='pingDiv'>P: {li.Ping}</div> : null}
              </div>
            </div>
          </li>
        )
      } else {
        return <li className='liContentRed' key={key} style={style}>{li.IPorName} is DOWN</li>
      }
    }

    return (
      <div>
        <TransitionMotion defaultStyles={this.getDefaultStyles()} styles={this.getStyles()} willLeave={this.willLeave} willEnter={this.willEnter}>
          {styles =>
            <ul id="contentList">
              {styles.map(({key, style, data: li}) =>
                {return contructListElement(key, style, li)}
              )}
            </ul>
          }
        </TransitionMotion>
        <Modal show={this.state.isOpen} onClose={this.toggleModal.bind(this)} onServerClick={this.handleServerClick.bind(this)} item={this.state.item} isConnected={this.state.isConnected}/>
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    conState: store.connectionState,
    sockMessage: store.socksMessage
  }
}

export default connect(mapStateToProps)(List)
