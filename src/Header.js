import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SortIco from 'react-icons/lib/fa/sort'

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

  setSort = (sort) => {
    this.setState({sort: sort})
    localStorage.setItem('sort', sort)
    this.props.sortCallback(sort)
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
        <div className="sort-block">
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
