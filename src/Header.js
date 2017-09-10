import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: 'trying to establish connection with CoD4 Launcher'
    }
  }

  filterServer = (e) => {
    this.props.callback(e.target.value.toLowerCase())
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
  }

  render() {
    return (
      <div id="topBlock">
        <label>CoD4 Servers</label>
        <div id="connectionCircle" className="tooltip" data-isUp="false">
          <span id="tooltip-text">{this.state.status}</span>
        </div>
        <input type="text" placeholder="filter servers" onKeyUp={this.filterServer.bind(this)}/>
      </div>
    );
  }
}

Header.PropTypes = {
  callback: PropTypes.func
}

export default Header;