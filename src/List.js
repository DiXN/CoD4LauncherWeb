import React, { Component } from 'react';
import Modal from './Modal.js';
import Websocket from './WebSocket.js';
import {TransitionMotion, spring, presets} from 'react-motion';

class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [],
      isOpen: false,
      item: null,
      IpOrName: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.socksMessage.servers !== undefined && nextProps.socksMessage.servers != null && nextProps.socksMessage.servers !== this.state.list) {
      document.querySelector('#mainContentBlock').style.display = 'block'
      document.querySelector('.spinner').style.display = 'none'

      this.setState({
        list: nextProps.socksMessage.servers,
        item: nextProps.socksMessage.servers.find((elem) => elem.IPorName === this.state.IpOrName)
      }, () => {
        if(this.state.list.length >= 12) {
          document.querySelector('#mainContentBlock').classList.add('smallContentBlock')
        } else {
          document.querySelector('#mainContentBlock').classList.remove('smallContentBlock')
        }
      })
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
    e.preventDefault()

    this.setState({
      IpOrName: item.IPorName,
      item: item
    });

    this.toggleModal()
  }

  toggleModal() {
    const open = this.state.isOpen

    if (open) {
      document.querySelector('#topBlock').style.zIndex = 1
    } else {
      document.querySelector('#topBlock').style.zIndex = 0
    }

    this.setState({
      isOpen: !open
    });
  }

  getDefaultStyles = () => {
    return this.state.list.map((li, i) => ({data: li, key: i.toString(), style: {paddingTop: 0, paddingBottom: 0, height: 0, opacity: 0.88}}))
  }

  getStyles = () => {
    return this.state.list.filter((elem) => elem.ServerName
    != null ? elem.ServerName.toLowerCase().indexOf(this.props.filter) > -1 : elem.IPorName.
        toLowerCase().indexOf(this.props.filter) > -1).sort((a, b) => b.CurrentPlayers - a.CurrentPlayers).map((item, key) => {
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
      height: spring(0, {stiffnes: 180, damping: 12}),
      paddingTop: spring(0),
      paddingBottom: spring(0),
      opacity: spring(0, {stiffnes: 180, damping: 12})
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
            onClick={() => {this.handleServerClick(li.IP)}} onMouseOver={(e) => {this.getMapImage(li.Map, e)}}
              onMouseOut={() => {document.querySelector('.mapCircle').classList.remove('mapCircleHover')}}>
            <div className='flexParent'>
              <div className='liTitleDiv'>{li.ServerName}</div>
              <div className='statsDiv'>
                <div className='playerDiv'>{li.CurrentPlayers}/{li.MaxPlayers}</div>
                <div className='pingDiv'>P: {li.Ping}</div>
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
        <Modal show={this.state.isOpen} onClose={this.toggleModal.bind(this)} onServerClick={this.handleServerClick.bind(this)} item={this.state.item}/>
      </div>
    )
  }
}

export default List;
