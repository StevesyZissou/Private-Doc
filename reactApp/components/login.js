import React from 'react';
import axios from 'axios';

// Material UI stuff
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

// Redux stuff 
import { login } from '../actions/index';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      greeting: 'Welcome to the MOQ DOCS Login!',
      username: '',
      password: ''
    };
  }

  componentWillMount() {
    console.log(this.props);
    axios.get('http://localhost:3000/')
    .then((res) => {
      this.setState({greeting: res.data});
    })
    .catch(function(err) {
      console.log(err);
    });
  }

  handleUsername (event) {
    this.setState({username: event.target.value});
    console.log('username = ', this.state.username);
  }

  handlePassword (event) {
    this.setState({password: event.target.value});
  }

  loginUser () {
    axios.post('http://localhost:3000/login', {
      username: this.state.username,
      password: this.state.password
    })
    .then((res) => {
      console.log(res.data);
      console.log("you have successfully sent a login request!");
      this.props.handleLogin(res.data.userId, res.data.docs);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render () {
    return (
      <div>
        {this.props.userId ? <Redirect to="/Portal" /> : <div></div>}
        <h3>Login </h3>
        <h3>{this.state.greeting}</h3>
        <TextField
          onChange={(event) => this.handleUsername(event)}
          hintText="Enter a username"
        />
        <TextField
          onChange={(event) => this.handlePassword(event)}
          hintText="Enter a password"
        />
        <RaisedButton label="Login" primary={true} onClick={() => this.loginUser()}/>
        <RaisedButton label="Woops! I actually need to create an account" primary={true} 
          onClick={() => console.log('go back to register')}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.userId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogin: (userId, docs) => {dispatch(login(userId, docs));}
  };
};

Login.propTypes = {
  userId: PropTypes.string,
  handleLogin: PropTypes.func
};

Login = connect(mapStateToProps, mapDispatchToProps)(Login);

export default Login;
