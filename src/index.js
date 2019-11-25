import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './style.css';

import { allReducers } from './services/reducers'; // REDUX REDUCERS
// import { createStore } from 'redux'; // REDUX STORE
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'; // REDUX PROVIDER

// CREATE REDUX STORE
// let store = createStore(
//   allReducers,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// CREATE REDUX STORE VIA TOOLKIT
const store = configureStore({
  reducer: allReducers
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
