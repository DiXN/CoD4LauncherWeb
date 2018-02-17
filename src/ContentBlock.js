import React from 'react'
import { connect } from 'react-redux';
import {conTypes, conToBool} from './reducers/connection-reducer.js'
import List from './List.js';

const ContentBlock = ({conState, filter, sort, socksMessage, firebaseList}) => {
  return(
    <div>
      {(conToBool(conState, conTypes.CONNECTED) || conToBool(conState, conTypes.ONLINE)) ?
      <div className="fadeIn" id="mainContentBlock">
        <List filter={filter} sort={sort} firebaseList={firebaseList}/>
      </div> : null}
    </div>
  )
}

const mapStateToProps = (store) => {
  return {
    conState: store.connectionState
  }
}

export default connect(mapStateToProps)(ContentBlock)