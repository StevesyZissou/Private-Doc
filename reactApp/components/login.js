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

const styles = {
  logo: {
    width: '30%', 
    height: '30%', 
    marginBottom: '5%'
  }, 
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%', 
    height: '100%', 
    fontFamily: 'Roboto, sans-serif'
  }, 
  createAccountWrapper: {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    width: '50%',
    marginTop: '5%'
  }
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '', 
      register: false 
    };
  }

  handleUsername (event) {
    this.setState({username: event.target.value});
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
      console.log(res.data.userId);
      this.props.handleLogin(res.data.userId, res.data.docs);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  createAccount() {
    this.setState({register: true}); 
  }

  render () {
    return (
      <div style={styles.container}>
        <img style={styles.logo} src="../reactApp/PrivateDoc.png" />
        {this.props.userId ? <Redirect to="/Portal" /> : <div></div>}
        {this.state.register ? <Redirect to="/Register" /> : <div></div>}
        <h3>Login </h3>
        <TextField
          onChange={(event) => this.handleUsername(event)}
          hintText="Enter a username"
        />
        <TextField
          onChange={(event) => this.handlePassword(event)}
          hintText="Enter a password"
        />
        <RaisedButton label="Login" onClick={() => this.loginUser()}/>
        <div style={styles.createAccountWrapper}>
          <h4>Don't have account? </h4>
          <RaisedButton label="Create an Account"
            onClick={() => this.createAccount()}
          />
        </div>
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
