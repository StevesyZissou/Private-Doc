import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router';
import Portal from './Portal';
import Document from './Document';
import Register from './Register';
import Login from './Login';

// Redux stuff 
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Router extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     userId: '597b734955a3ae0359e9d4bf', 
  //     docs: []
  //   };
  // }

  // setUser(userId) {
  //   this.setState({userId: userId});
  // }

  // setDocs(docs) {
  //   this.setState({docs: docs});
  //   console.log(this.state.docs);
  // }

  // OTTO: you changed the routes to make it easy to work on different components. Before finishing make sure that you change them back. 
  render() {
    // console.log('Router: this.props.userId = ', this.props.userId);
    return (
      <div>
          <Route path='/' 
            render={() => this.props.userId ? <div></div> : <Redirect to="/Login" /> }
          /> 
          
          <Route path='/Login' 
            render={() => <Login />}
          />

          <Route path='/Register' 
            render={() => <Register />}
          />

          <Route path='/Portal' render={() => 
            <Portal 
              userId={this.props.userId} 
            />} 
          />
          {this.props.docs ? this.props.docs.map(doc => 
            <Route key={doc._id} path={'/'+doc._id} render={() => 
              <Document docId={doc._id} />} 
            />) : <div></div>
          }
          {/* <Route path ='/' 
            render={() => this.props.userId ? <Redirect to="/Portal" /> : <Redirect to="/Login" /> }
          />  */}
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

Router.propTypes = {
  userId: PropTypes.string, 
  docs: PropTypes.array
};

Router = withRouter(connect(mapStateToProps, null)(Router));

export default Router;
