import React from 'react';
import { Route } from 'react-router-dom';
import Address from './Address';
import FoodTypeList from './FoodTypeList';
import QuickSearchGrid from './QuickSearchGrid';
import RestaurantList from './RestaurantList';

function FoodSearchFilter({
  address,
  setAddress,
  setDetectionEnabled,
  locationStatus,
  setLocationStatus,
  setCity,
  cityId,
  geoFindMe,
  foodTypeId,
  setFoodTypeId,
  restaurants,
  setRestaurants,
  restaurantStatus,
  setRestaurantStatus
}) {
  return (
    <form id="FoodSearchFilter">
      <Route
        exact
        path="/"
        render={props => (
          <>
            <Address
              {...props}
              address={address}
              setAddress={setAddress}
              locationStatus={locationStatus}
              setLocationStatus={setLocationStatus}
              setCity={setCity}
              geoFindMe={geoFindMe}
              setDetectionEnabled={setDetectionEnabled}
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
              locationStatus={locationStatus}
              setLocationStatus={setLocationStatus}
              setCity={setCity}
              geoFindMe={geoFindMe}
              setDetectionEnabled={setDetectionEnabled}
            />
            <FoodTypeList />
            <QuickSearchGrid
              {...props}
              foodTypeId={foodTypeId}
              setFoodTypeId={setFoodTypeId}
              cityId={cityId}
              setRestaurants={setRestaurants}
              setRestaurantStatus={setRestaurantStatus}
            />
            <RestaurantList
              {...props}
              restaurantStatus={restaurantStatus}
              setRestaurantStatus={setRestaurantStatus}
              restaurants={restaurants}
              setRestaurants={setRestaurants}
              cityId={cityId}
              foodTypeId={foodTypeId}
              setFoodTypeId={setFoodTypeId}
            />
          </>
        )}
      />
    </form>
  );
}

export default FoodSearchFilter;
