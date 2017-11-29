import React from 'react';
import axios from 'axios';

// React router stuff 
import { Link } from 'react-router-dom';

// Material UI stuff 
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

// Redux stuff 
import { logout, updatePortal } from '../actions/index';
import {connect} from 'react-redux'; 
import PropTypes from 'prop-types';

// DraftJS stuff
import {EditorState} from 'draft-js';

const styles = {
  logo: {
    maxWidth: '75px', 
    maxHeight: '75px'
  }, 
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    height: '5%', 
    width: '100%'
  }
};

class Portal extends React.Component {
  logOut() {
    this.props.handleLogOut();
  }

  componentWillMount() {
    axios.post('http://localhost:3000/docsList', {
      userId: this.props.userId
    })
    .then((res) => {
      this.props.handleUpdatePortal(res.data.user.docs);
    })
    .catch((err) => {console.log(err);});
  }

  handleNewDocName(event) {
    this.setState({newDocName: event.target.value});
  }

  createDoc() {
    axios.post('http://localhost:3000/createDoc', {
      userId: this.props.userId, 
      docName: this.state.newDocName, 
      editorState: EditorState.createEmpty()
    })
    .then((res) => {
      this.props.handleUpdatePortal(res.data.user.docs);
    })
    .catch((err) => {console.log(err);});
  }
  
  handleSharedDoc(event){
    this.setState({sharedDocId: event.target.value});
  }

  addSharedDoc() {
    axios.post('http://localhost:3000/addSharedDoc', {
      userId: this.props.userId,
      docId: this.state.sharedDocId
    })
    .then((res) => {
      this.props.handleUpdatePortal(res.data.user.docs);
    })
    .catch((err) => {console.log(err);})
  }
  
  render() {
    return (
      <div>
        <div style={styles.navBar}>
          <RaisedButton 
            label= "Logout"
            onClick = {() => this.props.handleLogOut()}
          />   
          <img style={styles.logo} src="../reactApp/PrivateDoc.png" />
        </div>
        <TextField
          onChange={(event) => this.handleNewDocName(event)}
          hintText="Document name"
        />
        <RaisedButton
          label = "Create a new document"
          primary= {true}
          onClick = {() => this.createDoc()}
        />
        <nav>
          <ul>
            {this.props.docs.map(doc => 
              <li key={doc._id}><Link to={'/'+doc._id}>{doc.title}</Link></li>
            )}
          </ul>
        </nav>
        <TextField 
          onChange={(event) => this.handleSharedDoc(event)}
          hintText="Paste a shared document ID here"
        />
        <RaisedButton 
          label="Add this document to my Private Docs" 
          primary={true}
          onClick={() => this.addSharedDoc()}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.userId, 
    docs: state.docs
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogOut: () => {dispatch(logout());},
    handleUpdatePortal: (docs) => {dispatch(updatePortal(docs));}
  };
};

Portal.propTypes = {
  handleLogOut: PropTypes.func,
  handleUpdatePortal: PropTypes.func
}; 

Portal = connect(mapStateToProps, mapDispatchToProps)(Portal); 

export default Portal;
