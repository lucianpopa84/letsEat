// IMPORT REDUCERS
// import { cartItemsReducer } from './cartItemsReducer';
// import { combineReducers } from 'redux';

// IMPORT REDUCERS VIA TOOLKIT
import cartItemsReducer from './cartItemsReducerToolkit';
import { combineReducers } from '@reduxjs/toolkit';


const allReducers = combineReducers({ cartItems: cartItemsReducer });

export { allReducers };
