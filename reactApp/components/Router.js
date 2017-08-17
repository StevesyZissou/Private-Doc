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

  render() {
    console.log(this.props.docs);
    return (
      <div>
        <Switch>
          {/* <Route path='/' 
            render={() => this.props.userId ? <div></div> : <Redirect to="/Login" /> }
          />  */}
          
          <Route path='/Login' 
            render={() => <Login />}
          />
          <Route path='/Portal' render={() => 
            <Portal 
              userId={this.props.userId} 
              setDocs={(docs) => this.setDocs(docs)}
            />} 
          />
          {this.props.docs.map(doc => {
            console.log(doc._id);
            return (<Route key={doc._id} path={'/'+doc._id} render={() => 
              <Document docId={doc._id} />} 
            />);
            }
          ) }
          <Route path='/' 
            render={() => this.props.userId ? <Redirect to="/Portal" /> : <Redirect to="/Login" /> }
          /> 
        </Switch>
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
