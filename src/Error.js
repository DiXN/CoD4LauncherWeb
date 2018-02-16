import React from 'react'
import { connect } from 'react-redux';
import {conTypes, conToBool} from './reducers/connection-reducer.js'

const Error = ({conState}) => {
  return(
    <div>
    {conToBool(conState, conTypes.OFFLINE) ?
      <div className="error" id="errorBlock" style={{display: 'block'}}>
        Could not connect to CoD4Launcher. check if the application is running on the same PC as the website
        <br/>and make sure that port 13660 is not blocked by any other service.
        <p>
          Currently only Firefox, Chrome and Opera are fully supported (HTTP).
          <br/>Although any Chromium or Mozilla based browser probably works.
        </p>
        When using Microsoft edge there is the possibility to "allow localhost loopback" in about:flags.
        <br/>However this is not a guarantee that connecting to the launcher works afterwards.
      </div> : null}
    </div>
  )
}

const mapStateToProps = (store) => {
  return {
    conState: store.connectionState
  }
}

export default connect(mapStateToProps)(Error)