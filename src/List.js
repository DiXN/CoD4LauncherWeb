import React, { Component } from 'react';
import Modal from './Modal.js';
import Websocket from './WebSocket.js';

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
      })
    }
  }

  getMapImage(map) {  
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
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {  
    const constructListElement = (className, item, key) => {
      return (
        <li className={className} key={key} onContextMenu={(e) => this.handleRightClick(e, item)} 
          onClick={() => {this.handleServerClick(item.IP)}} onMouseOver={() => {this.getMapImage(item.Map)}} 
              onMouseOut={() => {document.querySelector('.mapCircle').classList.remove('mapCircleHover')}}>
          <div className='flexParent'>
            <div className='liTitleDiv'>{item.ServerName}</div>                    
            <div className='statsDiv'>
              <div className='playerDiv'>{item.CurrentPlayers}/{item.MaxPlayers}</div>                         
              <div className='pingDiv'>P: {item.Ping}</div>           
            </div>
          </div>
        </li>
      );
    }

    const listItems = this.state.list.filter((elem) => elem.ServerName 
      != null ? elem.ServerName.toLowerCase().indexOf(this.props.filter) > -1 : elem.IPorName.
          toLowerCase().indexOf(this.props.filter) > -1).sort((a, b) => b.CurrentPlayers - a.CurrentPlayers).map((item, key) => {

      const maxPlayers = item.MaxPlayers
      const curPlayers = item.CurrentPlayers            
      const status = item.Status

      if (status !== 'DOWN') {
        if(maxPlayers - curPlayers >= 3) {
          return constructListElement('liContentGreen', item, key)
        } else if (maxPlayers - curPlayers === 0) {
          return constructListElement('liContentRed', item, key)
        } else if (maxPlayers - curPlayers <= 2){
          return constructListElement('liContentOrange', item, key)
        }
      } else {
        return <li className='liContentRed' key={key}>{item.IPorName} is DOWN</li>
      }
    })

    return (
      <div>
        <ul id="contentList">
          {listItems}
        </ul>
        <Modal show={this.state.isOpen} onClose={this.toggleModal.bind(this)} onServerClick={this.handleServerClick.bind(this)} item={this.state.item}/>
      </div>
    )
  }
}

export default List;