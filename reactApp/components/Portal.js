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

class Portal extends React.Component {
  logOut() {

  }

  componentWillMount() {
    console.log(this.props);
  }

  handleNewDocName(event) {
    this.setState({newDocName: event.target.value});
  }
  //
  // createDoc() {
  //   axios.post('http://localhost:3000/createDoc', {
  //     userId: this.state.userId,
  //     docName: this.state.newDocName
  //   })
  //   .then((res) => {
  //     console.log(res);
  //
  //
  // createDoc(){
  //   axios.post('/createDoc'), {
  //     params: {
  //       userId: this.state.userId
  //     }
  //   }
  //   .then(function (response) {
  //     axios.get('/edit/:docId'), {
  //       params: {
  //         userId: this.state.userId
  //       }
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // }

  createDoc() {
    console.log(this.props);
    axios.post('http://localhost:3000/createDoc', {
      userId: this.props.userId, 
      docName: this.state.newDocName, 
      editorState: null
    })
    .then((res) => {
      console.log(res.data.user.docs);
      this.props.handleUpdatePortal(res.data.user.docs);
    })
    .catch((err) => {
      console.log(err);
    });
  }
  
  loadDoc(){

  }

  render() {
    console.log(this.props.docs);
    return (
      <div>
        <RaisedButton 
          label= "Logout"
          primary={true}
          onClick = {() => this.props.handleLogOut()}
        />   
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
            {/* <li><Link to='/Document1'>Document 1</Link></li> */}
            {/* map over the documents in the state to get a list of the documents */}
          </ul>
        </nav>
        <input type="text" placeholder="Paste Document ID" />
        <input type="submit" value="Load Shared Document" onSubmit={()=>this.loadDoc()} />
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
