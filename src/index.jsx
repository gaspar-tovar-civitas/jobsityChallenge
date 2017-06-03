import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import App from './containers/app';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <App />
  </Provider>
  , document.querySelector('.container'));
