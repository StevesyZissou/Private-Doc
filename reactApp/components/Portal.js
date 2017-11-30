import React from 'react';
import axios from 'axios';

// React router stuff 
import { Link } from 'react-router-dom';

// Material UI stuff 
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

// Redux stuff 
import { logout, updatePortal } from '../actions/index';
import {connect} from 'react-redux'; 
import PropTypes from 'prop-types';

// DraftJS stuff
import {EditorState} from 'draft-js';

const styles = {
  logout: {
    verticalAlign: 'top'
  },
  logo: {
    maxWidth: '170px',
    marginLeft: '30%'
  }, 
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center', 
    width: '100%'
  }, 
  popover: {
    padding: '10vw'
  }
};

class Portal extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      createDocPopoverOpen: false,
      addSharedDocPopoverOpen: false
    };
  }

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

  openCreateDocPopover(event) {
    this.setState({
      createDocPopoverOpen: true,
      anchorElCreateDoc: event.currentTarget
    }); 
  }
  
  closeCreateDocPopover() {
    this.setState({
      createDocPopoverOpen: false,
    });
  }

  openAddSharedDoc(event) {
    this.setState({
      addSharedDocPopoverOpen: true, 
      anchorElSharedDoc: event.currentTarget
    })
  }

  closeAddSharedDocPopover(event) {
    this.setState({
      addSharedDocPopoverOpen: false
    })
  }

  createNewDoc() {
    axios.post('http://localhost:3000/createDoc', {
      userId: this.props.userId, 
      docName: this.state.newDocName, 
      editorState: EditorState.createEmpty()
    })
    .then((res) => {
      this.props.handleUpdatePortal(res.data.user.docs);
      this.closeCreateDocPopover(); 
    })
    .catch((err) => console.log(err));
  }
    
  handleSharedDoc(event){
    event.preventDefault();
    this.setState({sharedDocId: event.target.value});
  }

  addSharedDoc() {
    axios.post('http://localhost:3000/addSharedDoc', {
      userId: this.props.userId,
      docId: this.state.sharedDocId
    })
    .then((res) => {
      this.props.handleUpdatePortal(res.data.user.docs);
      this.closeCreateDocPopover();
    })
    .catch((err) => {console.log(err);})
  }
  
  render() {
    return (
      <div>
        <div style={{height:'100%'}}>
          <span>
            <RaisedButton 
              style={styles.logout}
              label= "Logout"
              onClick = {() => this.props.handleLogOut()}
            />
          </span> 
          <img style={styles.logo} src="../reactApp/PrivateDoc.png" /> 
        </div>
        <div>
            <RaisedButton
              label = "Create a new document"
              primary={true}
              onClick = {(event) => this.openCreateDocPopover(event)}
            />
              <Popover 
                style={styles.popover}
                open={this.state.createDocPopoverOpen}
                anchorEl={this.state.anchorElCreateDoc}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={() => this.closeCreateDocPopover()}
                animation={PopoverAnimationVertical}
              > 
                <TextField
                  onChange={(event) => this.handleNewDocName(event)}
                  hintText="Document name"
                />
                <RaisedButton 
                  style={{marginLeft: '2vw'}}
                  label= "Create"
                  primary={true}
                  onClick={() => this.createNewDoc()}
                />
              </Popover>
          </div>
        <nav>
          <ul>
            {this.props.docs.map(doc => 
              <li key={doc._id}><Link to={'/'+doc._id}>{doc.title}</Link></li>
            )}
          </ul>
        </nav>
        <div>
          <RaisedButton
            label = "Add a doc that someone shared with you"
            primary={true}
            onClick = {(event) => this.openAddSharedDoc(event)}
          />
          <Popover 
            style={styles.popover}
            open={this.state.addSharedDocPopoverOpen}
            anchorEl={this.state.anchorElSharedDoc}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => this.closeAddSharedDocPopover()}
            animation={PopoverAnimationVertical}
          >
            <TextField 
              onChange={(event) => this.handleSharedDoc(event)}
              hintText="Paste the shared document ID here"
            />
            <RaisedButton 
              style={{marginLeft: '2vw'}}
              label="Add" 
              primary={true}
              onClick={() => this.addSharedDoc()}
            />
          </Popover> 
        </div>  
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
