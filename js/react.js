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

   function attachTopMenuEventListeners() {
      let topDropdownMenu = document.querySelector(".dropdown-content");

      function toggleMenu() {
         if (topDropdownMenu.style.display === "block") {
            topDropdownMenu.style.display = "none";
         } else {
            topDropdownMenu.style.display = "block";
         }
      }

      document.querySelector("#topMenu").addEventListener("click", () => toggleMenu());
      document.querySelector("#topMenuHome").addEventListener("click", () => toggleMenu());
      document.querySelector("#topMenuAbout").addEventListener("click", () => toggleMenu());
      document.querySelector("#topMenuContact").addEventListener("click", () => toggleMenu());
   }

   React.useEffect(() => {
      attachTopMenuEventListeners();
   });

   return (
      <Router>
         <div className="topnav">
            <a id="topMenu" className="dropdown">
               <i className="fas fa-bars" />
            </a>
            <div className="dropdown-content">
               <nav id="topMenu">
                  <ul>
                     <li>
                        <NavLink exact to="/letsEat/" id="topMenuHome">
                           <i className="fas fa-home"> </i> Home
                        </NavLink>
                     </li>
                     <li>
                        <NavLink to="/letsEat/about" id="topMenuAbout">
                           <i className="far fa-question-circle"> </i> About
                        </NavLink>
                     </li>
                     <li>
                        <NavLink to="/letsEat/contact" id="topMenuContact">
                           <i className="far fa-address-card" /> Contact
                        </NavLink>
                     </li>
                  </ul>
               </nav>
            </div>

            <div id="topnav-right">
               <NavLink to="/letsEat/login">
                  <i className="fas fa-user-circle"> </i>
               </NavLink>
               <NavLink to="/letsEat/cart" id="cartButton">
                  <i className="fas fa-shopping-cart" />
               </NavLink>
               <span className="cartItems">
                  {cartItemsNumber != ("" || 0) ? cartItemsNumber : ""}
               </span>
            </div>
         </div>
         <NavLink to="/letsEat/">
            <div className="letsEatLogo" />
         </NavLink>
         {/* <Route path="/letsEat/cart" render={renderCartHtml} /> */}
         <Route path="/letsEat/cart" render={renderReactCart} />
         <Route path="/letsEat/about" render={renderReactAbout} />
         <Route path="/letsEat/contact" render={renderReactContact} />
         <Route
            exact
            path="/letsEat/"
            render={() => (window.location.pathname = "/letsEat/index.html")}
         />
      </Router>
   );
}

ReactDOM.render(<Topnav />, document.querySelector("#topnav"));

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

function About() {
   const aboutStyle = { color: "darkblue" };
   const h2Style = { textAlign: "center" };
   return (
      <div>
         <h2 style={h2Style}>
            About <span style={aboutStyle}>Let's Eat</span>
         </h2>
         <hr />
         <p>This website is designed to help you order food quick and easy.</p>
         <p>
            If you have a favourite restaurant which is not listed, please use
            the <i>Add a restaurant</i> form.
         </p>
         <br />
         <p>© 2019 Lucian Popa</p>
      </div>
   );
}

function Contact() {
   return (
      <div>
         <div className="checkout">
            <h2>Contact us</h2>
         </div>

         <div className="contactForm">
            <form>
               <label htmlFor="name">Name</label>
               <input
                  type="text"
                  id="name"
                  name="firstname"
                  autoComplete="name"
                  placeholder="Your name.."
               />

               <label htmlFor="city">City</label>
               <select id="city" name="city">
                  <option value="Craiova">Craiova</option>
                  <option value="Brasov">Brasov</option>
                  <option value="Cluj">Cluj</option>
               </select>

               <label htmlFor="subject">Subject</label>
               <textarea
                  id="subject"
                  name="subject"
                  placeholder="Your message.."
                  style={{ height: "100px" }}
               />
               <input type="submit" value="Send" />
            </form>
            <p>
               Or send us an e-mail at
               <a
                  href="mailto:contact@letseat.com?Subject=Hello%20Letseat"
                  target="_top"
               >
                  contact@letseat.com
               </a>
            </p>
         </div>
      </div>
   );
}

function renderReactCart() {
   // remove html elements from view
   removeElementByClass("addressForm");
   removeElementById("foodQuickSearchGrid");
   removeElementByClass("foodSearchFilter");
   removeElementByClass("restaurantList");
   removeElementByClass("foodList");
   ReactDOM.render(<Cart />, document.querySelector("#cart"));
}

function renderReactAbout() {
   // remove html elements from view
   removeElementByClass("addressForm");
   removeElementById("foodQuickSearchGrid");
   removeElementByClass("foodSearchFilter");
   removeElementByClass("restaurantList");
   removeElementByClass("foodList");
   ReactDOM.unmountComponentAtNode(document.querySelector("#contact"));
   ReactDOM.unmountComponentAtNode(document.querySelector("#cart"));
   ReactDOM.render(<About />, document.querySelector("#about"));
}

function renderReactContact() {
   // remove html elements from view
   removeElementByClass("addressForm");
   removeElementById("foodQuickSearchGrid");
   removeElementByClass("foodSearchFilter");
   removeElementByClass("restaurantList");
   removeElementByClass("foodList");
   ReactDOM.unmountComponentAtNode(document.querySelector("#about"));
   ReactDOM.unmountComponentAtNode(document.querySelector("#cart"));
   ReactDOM.render(<Contact />, document.querySelector("#contact"));
}
