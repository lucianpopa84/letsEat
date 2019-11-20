import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './style.css';

import { allReducers } from './services/reducers'; // REDUX REDUCER
import { createStore } from 'redux'; // REDUX STORE
import { Provider } from 'react-redux'; // REDUX PROVIDER

// CREATE REDUX STORE
let store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
