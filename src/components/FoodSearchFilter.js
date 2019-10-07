import React from 'react';
import { Route } from 'react-router-dom';
import Address from './Address';
import FoodTypeList from './FoodTypeList';
import QuickSearchGrid from './QuickSearchGrid';
import RestaurantList from './RestaurantList';

function FoodSearchFilter({
  address,
  setAddress,
  detectedAddress,
  detectionEnabled,
  setDetectionEnabled,
  locationStatus,
  setLocationStatus,
  city,
  setCity,
  cityId,
  setCityId,
  getCityId,
  geoFindMe,
  foodTypeId,
  setFoodTypeId,
  restaurants,
  setRestaurants,
  restaurantStatus,
  setRestaurantStatus
}) {
  function clickOutsideMenu(e) {
    let modalMenu = document.querySelector('.dropdown-content');
    let modalMenuButton = document.querySelector('#topMenu');
    if (e.target !== modalMenu && e.target !== modalMenuButton) {
      modalMenu.style.display = 'none';
    }
  }

  return (
    <form id="FoodSearchFilter" onClick={e => clickOutsideMenu(e)}>
      <Route
        exact
        path="/"
        render={props => (
          <>
            <Address
              {...props}
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
            />
            <FoodTypeList />
            <QuickSearchGrid {...props} />
          </>
        )}
      />
      <Route
        path="/food/:foodType"
        render={props => (
          <>
            <Address
              {...props}
              address={address}
              setAddress={setAddress}
              detectedAddress={detectedAddress}
              detectionEnabled={detectionEnabled}
              setDetectionEnabled={setDetectionEnabled}
              locationStatus={locationStatus}
              setLocationStatus={setLocationStatus}
              setCity={setCity}
              getCityId={getCityId}
              geoFindMe={geoFindMe}
            />
            <FoodTypeList />
            <QuickSearchGrid
              {...props}
              foodTypeId={foodTypeId}
              setFoodTypeId={setFoodTypeId}
              cityId={cityId}
              restaurants={restaurants}
              setRestaurants={setRestaurants}
              setRestaurantStatus={setRestaurantStatus}
            />
            <RestaurantList
              {...props}
              foodTypeId={foodTypeId}
              city={city}
              cityId={cityId}
              restaurantStatus={restaurantStatus}
              restaurants={restaurants}
            />
          </>
        )}
      />
    </form>
  );
}

export default FoodSearchFilter;
