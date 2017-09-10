import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Scrollbars from 'react-scrollbar-js';

class Modal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      map: null
    }
  }

  getMapImage = (map) => {
    import(`./img/maps/${map}.jpg`)
    .then(mapImage => {
      this.setState({
        map: `url("${mapImage}")`
      })
    })
    .catch(err => {
      this.setState({
        map: null
      })
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== undefined && nextProps.item !== null) {
      this.getMapImage(nextProps.item.Map)
    }
  }

  onClickOutside(event) {
    if(!event.target.closest('.modal')) {
      this.props.onClose()
    }
  }

  render() {  
    if(!this.props.show) {
      return <ReactCSSTransitionGroup transitionName="fade"  transitionEnterTimeout={1000} transitionLeaveTimeout={1000}/>
    }

    const playerStatus = () => {
      const maxPlayers = this.props.item.MaxPlayers
      const curPlayers = this.props.item.CurrentPlayers            

      if(maxPlayers - curPlayers >= 3) {
        return { color: 'rgb(0, 110, 0)' }
      } else if (maxPlayers - curPlayers === 0) {
        return { color: 'rgb(255, 70, 0)' }
      } else if (maxPlayers - curPlayers <= 2){
        return { color: 'rgb(255, 150, 0)' }
      }
    }

    const pingStatus = () => {
      const ping = this.props.item.Ping

      if(ping <= 50) {
        return { color: 'rgb(0, 110, 0)' }
      } else if(ping <= 150) {
        return { color: 'rgb(255, 150, 0)' }
      } else {
        return { color: 'rgb(255, 70, 0)' }
      }
    }

    const playersContainer = () => {
      if(this.props.item.ListOfPlayers.length > 0 && this.props.item.ListOfPlayers[0] !== '') {
        return this.props.item.ListOfPlayers.sort((a, b) => b.split(',')[0] - a.split(',')[0]).map((item, key) => {
          const splitItem = item.split(',')

          return(
            <div className="playerContainer" key={key}>
              <div className="flexParent">
                <div className="liTitleDiv">{splitItem[2]}</div>
                <div className="statsDiv">
                  <div>{splitItem[1]}</div>                         
                </div>
                <div className="statsDiv">
                  <div>{splitItem[0]}</div>  
                </div>
              </div>
            </div>
          )
        })
      } else {
        return (
          <div className="flexParent">
            <div className="liTitleDiv" style={{backgroundColor: 'rgba(63, 63, 68, 0.8)'}}>There are no players on this server.</div>
          </div>
        )
      }
    }

    return(
      <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
        <div className="backdrop" onClick={(e) => {this.onClickOutside(e)}}>
          <div className="modal" style={{backgroundImage : this.state.map}}>
            <div className="header">
              {this.props.item.ServerName}
              <span onMouseDown={this.props.onClose}>&#x2715;</span>
            </div>
            <div className="body">
              <div className="titleContainer">
                <div className="flexParent">
                  <div className="liTitleDiv">Player</div>
                  <div className="statsDiv">Ping</div>
                  <div className="statsDiv">Score</div>                                   
                </div>
              </div>
              <Scrollbars style={{maxHeight: '30em'}} speed={75}>
                <div className="playersList">
                  {playersContainer()}
                </div>
              </Scrollbars>
            </div>
            <div className="footer">
              <div>
                <span style={pingStatus()}>Ping: {this.props.item.Ping}</span>
              </div>
              <div>
                <span style={playerStatus()}>Players: {this.props.item.CurrentPlayers}/{this.props.item.MaxPlayers}</span>
              </div>
              <div>
                <button onClick={() => {this.props.onServerClick(this.props.item.IP)}}>Connect</button>
                <button className="danger" onClick={this.props.onClose}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onServerClick: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

export default Modal;