import { useState } from "react";

function useCartItems() {
   // get food items from localstorage
   const [cartItems, setCartItems] = useState(
      JSON.parse(localStorage.getItem("cartItems")) || []
   );
   
   const [cartItemsNumber, setCartItemsNumber] = useState(
      cartItems.reduce((total, cartItem) => {
         return total + parseFloat(cartItem.quantity);
      }, 0)
   );

   return {
      cartItems,
      setCartItems,
      cartItemsNumber,
      setCartItemsNumber
   };
}
export default useCartItems;
