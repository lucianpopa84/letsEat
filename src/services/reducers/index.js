import { cartItemsReducer } from './cartItemsReducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({ cartItems: cartItemsReducer });

export { allReducers };
