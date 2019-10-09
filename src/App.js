import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Topnav from './components/Topnav';
import Footer from './components/Footer';
import Cart from './components/Cart';
import About from './components/About';
import Contact from './components/Contact';
import FoodSearchFilter from './components/FoodSearchFilter';
import Restaurant from './components/Restaurant';
import Login from './components/Login';
import useCartItems from './useCartItems.js';
import useGeocoder from './useGeocoder';
import { AppContext } from './AppContext';

function App() {
  const { cartItems, setCartItems, cartItemsNumber } = useCartItems();
  const {
    address,
    setAddress,
    detectedAddress,
    locationStatus,
    setLocationStatus,
    setDetectionEnabled,
    city,
    setCity,
    cityId,
    getCityId,
    geoFindMe
  } = useGeocoder();

  function clickOutsideMenu(e) {
    let modalMenu = document.querySelector('.dropdown-content');
    let modalMenuButton = document.querySelector('#topMenu');
    let modalMenuButtonIcon = document.querySelector('#topMenuIcon');
    if (
      e.target !== modalMenu &&
      e.target !== modalMenuButton &&
      e.target !== modalMenuButtonIcon
    ) {
      modalMenu.style.display = 'none';
    }
  }

  useEffect(() => {
    geoFindMe();
  }, [detectedAddress, geoFindMe]);

  useEffect(() => {
    getCityId(city);
  }, [city, getCityId]);

  const [foodTypeId, setFoodTypeId] = useState(
    localStorage.getItem('foodTypeId') || ''
  );
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantStatus, setRestaurantStatus] = useState(null);

  return (
    <div id="app" onClick={e => clickOutsideMenu(e)}>
      <Router>
        <AppContext.Provider
          value={{
            cartItemsNumber,
            cartItems,
            setCartItems,
            address,
            setAddress,
            setDetectionEnabled,
            locationStatus,
            setLocationStatus,
            geoFindMe,
            setCity,
            cityId,
            foodTypeId,
            setFoodTypeId,
            restaurants,
            setRestaurants,
            restaurantStatus,
            setRestaurantStatus
          }}
        >
          <Route path="/" component={Topnav} />
          <Route path="/login" component={Login} />
          <Route path="/cart" component={Cart} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <FoodSearchFilter />
          <Route path="/restaurant/:restaurantId" component={Restaurant} />
          <Route path="/" component={Footer} />
        </AppContext.Provider>
      </Router>
    </div>
  );
}

export default App;
