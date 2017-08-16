import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers/index';
import Container from './components/Container';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// import Draft from '../node_modules/draft-js/dist/Draft.css';
require ('./css/main.css');

// Redux setup 
const store = createStore(reducer);
console.log('store = ', store.getState());

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Container />
    </Provider>
  </MuiThemeProvider>,
   document.getElementById('root')
);
