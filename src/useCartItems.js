import { useState } from "react";

function useCartItems() {
   // get food items from localstorage
   const [cartItems, setCartItems] = useState(
      JSON.parse(localStorage.getItem("cartItems")) || []
   );
   
   let cartItemsNumber = 0;
   if (cartItems.length >=1 ){
      cartItemsNumber = cartItems.reduce((total, cartItem) => {
         return total + parseFloat(cartItem.quantity);
      }, 0);
   }  

   return {
      cartItems,
      setCartItems,
      cartItemsNumber
   };
}
export default useCartItems;
