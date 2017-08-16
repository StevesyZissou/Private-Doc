import React from 'react';
import Router from './Router';
import { HashRouter } from 'react-router-dom';
const Container = () => (
  <div>
    <HashRouter>
      <Router />
    </HashRouter>
  </div>
);

export default Container;
