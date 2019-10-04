import React, { useState } from 'react';
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

function App() {
  const { cartItems, setCartItems, cartItemsNumber } = useCartItems();
  const {
    address, setAddress,
    detectedAddress,
    locationStatus, setLocationStatus,
    detectionEnabled,
    setDetectionEnabled,
    city, setCity,
    cityId, setCityId,
    getCityId,
    geoFindMe
  } = useGeocoder();

  const [foodTypeId, setFoodTypeId] = useState(
    localStorage.getItem('foodTypeId') || ''
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
      <Route path="/login" component={Login} />
      <Route
        path="/cart"
        render={props => (
          <Cart
            {...props}
            cartItems={cartItems}
            setCartItems={setCartItems}
            address={address}
            setAddress={setAddress}
            detectedAddress={detectedAddress}
            detectionEnabled={detectionEnabled}
            setDetectionEnabled={setDetectionEnabled}
            locationStatus={locationStatus}
            setLocationStatus={setLocationStatus}
            setCity={setCity}
            geoFindMe={geoFindMe}
          />
        )}
      />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <FoodSearchFilter
        address={address}
        setAddress={setAddress}
        detectedAddress={detectedAddress}
        detectionEnabled={detectionEnabled}
        setDetectionEnabled={setDetectionEnabled}
        locationStatus={locationStatus}
        setLocationStatus={setLocationStatus}
        city={city}
        setCity={setCity}
        cityId={cityId}
        setCityId={setCityId}
        getCityId={getCityId}
        geoFindMe={geoFindMe}
        foodTypeId={foodTypeId}
        setFoodTypeId={setFoodTypeId}
        restaurants={restaurants}
        setRestaurants={setRestaurants}
        restaurantStatus={restaurantStatus}
        setRestaurantStatus={setRestaurantStatus}
      />
      <Route
        path="/restaurant/:restaurantId"
        render={props => (
          <Restaurant
            {...props}
            foodTypeId={foodTypeId}
            cityId={cityId}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        )}
      />
      <Route path="/" component={Footer} />
    </Router>
  );
}

export default App;
