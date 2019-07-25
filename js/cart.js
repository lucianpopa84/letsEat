const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const NavLink = ReactRouterDOM.NavLink;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

function Topnav() {
   const [cartItemsNumber, setCartItemsNumber] = React.useState(
      JSON.parse(localStorage.getItem("cartItemsNumber")) || ""
   );

   return (
      <Router>
         <NavLink to="/letsEat/login">
            <i className="fas fa-user-circle"> </i>
         </NavLink>
         <NavLink to="/letsEat/cart" id="cartButton">
            <i className="fas fa-shopping-cart" />
         </NavLink>
         <span className="cartItems">
            {cartItemsNumber != ("" || 0) ? cartItemsNumber : ""}
         </span>
         <Route exact path="/letsEat/cart" render={renderCartHtml} />
      </Router>
   );
}

ReactDOM.render(<Topnav />, document.querySelector("#topnav-right"));

function Cart() {
   // get food items from localstorage
   const [cartItems, setCartItems] = React.useState(
      JSON.parse(localStorage.getItem("cartItems")) || []
   );

   // compute total price
   let totalPrice = cartItems.reduce((total, cartItem) => {
      return total + cartItem.quantity * parseFloat(cartItem.itemPrice);
   }, 0);
   let deleteCharacter = "\u2717";

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
                                    onClick={() => removeItem()}
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
                  <i className="fas fa-map-marker-alt"> </i>
                  <p id="detectedDeliveryPlace"> </p>
                  <input
                     name="address"
                     id="manualAddress"
                     autoComplete="address-level2"
                     placeholder="Change address"
                     onChange={() => handleAddressChange()}
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
                  onChange={() => handleNameChange()}
               />

               <label htmlFor="clientPhone">Phone </label>
               <input
                  type="tel"
                  id="clientPhone"
                  name="phone"
                  placeholder="Enter phone number"
                  autoComplete="tel"
                  required
                  onChange={() => handlePhoneChange()}
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
                  onChange={() => handleTimeChange()}
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

function renderCartHtml() {
   // remove html elements from view
   removeElementByClass("addressForm");
   removeElementById("foodQuickSearchGrid");
   removeElementByClass("foodSearchFilter");
   removeElementByClass("restaurantList");
   removeElementByClass("foodList");
   ReactDOM.render(<Cart />, document.querySelector("#cart"));
}
