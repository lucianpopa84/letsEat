import {
  REMOVE_CART_ITEM,
  UPDATE_CART_ITEM,
  ADD_CART_ITEM
} from '../reducers/cartItemsReducer';

const removeCartItem = (cartItem) => {
  return {
    type: REMOVE_CART_ITEM,
    payload: {
      cartItemId: cartItem.id
    }
  };
};

const updateCartItem = (e, cartItem) => {
  return {
    type: UPDATE_CART_ITEM,
    payload: {
      cartItemId: cartItem.id,
      newQuantity: e.target.value
    }
  };
};

const addCartItem = (cartItem) => {
  return {
    type: ADD_CART_ITEM,
    payload: {
      newCartItem: cartItem
    }
  };
};

export { removeCartItem, updateCartItem, addCartItem };
