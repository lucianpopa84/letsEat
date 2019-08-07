import React, { useEffect } from "react";
import useCartItems from "../useCartItems.js";
import useGeocoder from "../useGeocoder";

function Cart() {
   const { cartItems, setCartItems, setCartItemsNumber } = useCartItems();
   const {
      address,
      setAddress,
      detectedAddress,
      geoFindMe,
      locationStatus
   } = useGeocoder();
   // compute total price
   let totalPrice = cartItems.reduce((total, cartItem) => {
      return total + cartItem.quantity * parseFloat(cartItem.itemPrice);
   }, 0);
   let deleteCharacter = "\u2717";

   function removeCartItem(cartItemId) {
      const newCartItems = [...cartItems];
      const index = newCartItems.findIndex(
         cartItem => cartItem.id === cartItemId
      );
      newCartItems.splice(index, 1);
      setCartItems(newCartItems);
      setCartItemsNumber(
         cartItems.reduce((total, cartItem) => {
            return total + parseFloat(cartItem.quantity);
         }, 0)
      );
   }

   function updateCart() {
      // work in progress
   }

   function submitOrder() {
      // work in progress
   }

   function nameChange() {
      // work in progress
   }

   function phoneChange() {
      // work in progress
   }

   function timeChange() {
      // work in progress
   }

   useEffect(() => {
      // update cart items in localstorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
   }, [cartItems]);

   useEffect(() => {
      geoFindMe();
   }, [detectedAddress]);

   return (
      <div>
         <div className="checkout">
            <h2>Cart</h2>
         </div>

         <div className="foodList">
            <div className="flex-container">
               {cartItems.map(cartItem => (
                  <div
                     key={cartItem.foodName}
                     className="foodCard"
                     data-name={cartItem.foodName}
                     data-price={cartItem.itemPrice}
                  >
                     <div className="row">
                        <div className="col-3">
                           <div className="card-image">
                              <img
                                 src={cartItem.imageSrc}
                                 alt={cartItem.imageAlt}
                              />
                           </div>
                        </div>
                        <div className="col-3">
                           <div className="card-delivery">
                              <h4 className="foodName">{cartItem.foodName}</h4>
                           </div>
                        </div>
                        <div className="col-4">
                           <div className="card-pricing">
                              <form className="priceForm">
                                 <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    max="10"
                                    value={cartItem.quantity}
                                    className="cartQuantityInput"
                                    onChange={() => updateCart()}
                                 />
                                 <input
                                    type="button"
                                    value={deleteCharacter}
                                    onClick={e => removeCartItem(cartItem.id)}
                                 />
                              </form>
                           </div>
                        </div>
                        <div className="col-2">
                           <p className="price">
                              {cartItem.itemPrice * cartItem.quantity} RON
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="total">
            <h2 id="totalPrice">Total = {totalPrice} RON</h2>
         </div>
         <div className="checkoutForm">
            <form id="checkoutForm" onSubmit={() => submitOrder()}>
               <div className="checkoutAddress flex-container">
                  <i
                     className="fas fa-map-marker-alt"
                     onClick={() => geoFindMe()}
                  >
                     {" "}
                  </i>
                  {address ? (
                     <p id="detectedDeliveryPlace"> {address}</p>
                  ) : (
                     <p id="detectedDeliveryPlace">{locationStatus}</p>
                  )}
                  <input
                     name="address"
                     id="manualAddress"
                     autoComplete="address-level2"
                     placeholder="Change address"
                     onChange={e =>
                        setAddress(`Selected location: ${e.target.value}`)
                     }
                     onClick={e => (e.target.value = "")}
                  />
               </div>

               <label htmlFor="clientName">Name </label>
               <input
                  type="text"
                  id="clientName"
                  name="name"
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                  onChange={() => nameChange()}
               />

               <label htmlFor="clientPhone">Phone </label>
               <input
                  type="tel"
                  id="clientPhone"
                  name="phone"
                  placeholder="Enter phone number"
                  autoComplete="tel"
                  required
                  onChange={() => phoneChange()}
               />

               <label htmlFor="deliveryTime">Preferred delivery time:</label>
               <input
                  type="time"
                  id="deliveryTime"
                  min="11:00"
                  max="21:00"
                  step="900"
                  value="12:30"
                  name="delivery"
                  onChange={() => timeChange()}
               />

               <label htmlFor="comments">Comments</label>
               <textarea
                  id="comments"
                  name="comments"
                  style={{ height: "100px" }}
                  maxLength={1000}
                  placeholder="Delivery instructions:"
               />
               <input type="submit" value="Submit order" />
            </form>
         </div>
      </div>
   );
}

export default Cart;
