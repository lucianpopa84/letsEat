export const REMOVE_CART_ITEM = 'remove_cart_item';
export const UPDATE_CART_ITEM = 'update_cart_item';
export const ADD_CART_ITEM = 'add_cart_item';

const initialState = JSON.parse(localStorage.getItem('cartItems')) || [];

const cartItemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_CART_ITEM: {
      const cartItemIndex = [...state].findIndex(
        cartItem => cartItem.id === action.cartItemId
      );
      return [
        ...state.slice(0, cartItemIndex),
        ...state.slice(cartItemIndex + 1)
      ];
    }

    case UPDATE_CART_ITEM: {
      const cartItemIndex = [...state].findIndex(
        cartItem => cartItem.id === action.cartItemId
      );
      const newQuantity = action.newQuantity;
      return [
        ...state.slice(0, cartItemIndex),
        { ...state[cartItemIndex], quantity: newQuantity },
        ...state.slice(cartItemIndex + 1)
      ];
    }

    case ADD_CART_ITEM: {
      const newCartItem = action.newCartItem;
      return [...state, newCartItem];
    }

    default:
      return state;
  }
};

export { cartItemsReducer };
