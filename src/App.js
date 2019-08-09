import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Topnav from "./components/Topnav";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import About from "./components/About";
import Contact from "./components/Contact";
import Address from "./components/Address";
import FoodTypeList from "./components/FoodTypeList";
import QuickSearchGrid from "./components/QuickSearchGrid";
import RestaurantList from "./components/RestaurantList";
import useCartItems from "./useCartItems.js";
import useGeocoder from "./useGeocoder";

function App() {
   const {
      cartItems,
      setCartItems,
      cartItemsNumber,
      setCartItemsNumber
   } = useCartItems();
   const {
      address, setAddress,
      detectedAddress,
      locationStatus, setLocationStatus,
      setCity,
      cityId, getCityId,
      geoFindMe
   } = useGeocoder();

   const [foodTypeId, setFoodTypeId] = useState(
      localStorage.getItem("foodTypeId") || ""
   );
   const [restaurants, setRestaurants] = useState([]);
   const [restaurantStatus, setRestaurantStatus] = useState(null);

   return (
      <Router>
         <Route
            path="/"
            render={props => (
               <Topnav {...props} cartItemsNumber={cartItemsNumber} />
            )}
         />
         <Route
            path="/cart"
            render={props => (
               <Cart
                  {...props}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  setCartItemsNumber={setCartItemsNumber}
                  address={address}
                  setAddress={setAddress}
                  locationStatus={locationStatus}
                  setLocationStatus={setLocationStatus}
                  setCity={setCity}
                  geoFindMe={geoFindMe}
               />
            )}
         />
         <Route path="/about" component={About} />
         <Route path="/contact" component={Contact} />
         <form id="FoodSearchFilter">
            <Route
               exact
               path="/"
               render={props => (
                  <Address
                     {...props}
                     address={address}
                     setAddress={setAddress}
                     detectedAddress={detectedAddress}
                     locationStatus={locationStatus}
                     setLocationStatus={setLocationStatus}
                     setCity={setCity}
                     cityId={cityId}
                     getCityId={getCityId}
                     geoFindMe={geoFindMe}
                  />
               )}
            />
            <Route exact path="/" component={FoodTypeList} />
            <Route exact path="/" component={QuickSearchGrid} />
            <Route
               path="/food/:foodType"
               render={props => (
                  <Address
                     {...props}
                     address={address}
                     setAddress={setAddress}
                     detectedAddress={detectedAddress}
                     locationStatus={locationStatus}
                     setLocationStatus={setLocationStatus}
                     setCity={setCity}
                     cityId={cityId}
                     getCityId={getCityId}
                     geoFindMe={geoFindMe}
                  />
               )}
            />
            <Route path="/food/:foodType" component={FoodTypeList} />
            <Route
               path="/food/:foodType"
               render={props => (
                  <QuickSearchGrid
                     {...props}
                     foodTypeId={foodTypeId}
                     setFoodTypeId={setFoodTypeId}
                     cityId={cityId}
                     restaurants={restaurants}
                     setRestaurants={setRestaurants}
                     setRestaurantStatus={setRestaurantStatus}
                  />
               )}
            />
            <Route
               path="/food/:foodType"
               render={props => (
                  <RestaurantList
                     {...props}
                     foodTypeId={foodTypeId}
                     cityId={cityId}
                     restaurantStatus={restaurantStatus}
                     restaurants={restaurants}
                  />
               )}
            />
         </form>
         <Route path="/" component={Footer} />
      </Router>
   );
}

export default App;
