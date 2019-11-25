import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('cartItems')) || [];

const cartItemsSlice = createSlice({
  name: 'cartItems',
  initialState: initialState,
  reducers: {
    addCartItem(state, action) {
      const { newCartItem } = action.payload;
      state.push(newCartItem);
    },

    updateCartItem(state, action) {
      const { cartItemId, newQuantity } = action.payload;
      const cartItem = state.find(cartItem => cartItem.id === cartItemId);
      if (cartItem) {
        cartItem.quantity = newQuantity;
      }
    },

    removeCartItem(state, action) {
      const { cartItemId } = action.payload;
      const cartItemIndex = state.findIndex(
        cartItem => cartItem.id === cartItemId
      );
      if (cartItemIndex !== -1) {
        state.splice(cartItemIndex, 1);
      }
    }
  }
});

export const {
  addCartItem,
  updateCartItem,
  removeCartItem
} = cartItemsSlice.actions;
export default cartItemsSlice.reducer;
