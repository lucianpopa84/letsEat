import React from "react";
import { Route } from "react-router-dom";
import Address from "./Address";
import FoodTypeList from "./FoodTypeList";
import QuickSearchGrid from "./QuickSearchGrid";
import RestaurantList from "./RestaurantList";

function FoodSearchFilter({
   location, setLocation,
   detectedAddress,
   locationStatus, setLocationStatus,
   city, setCity,
   cityId, setCityId,
   getCityId,
   geoFindMe,
   foodTypeId, setFoodTypeId,
   restaurants, setRestaurants,
   restaurantStatus, setRestaurantStatus
}) {
   return (
      <form id="FoodSearchFilter">
         <Route
            exact
            path="/"
            render={props => (
               <Address
                  {...props}
                  location={location} setLocation={setLocation}
                  detectedAddress={detectedAddress}
                  locationStatus={locationStatus} setLocationStatus={setLocationStatus}
                  city={city} setCity={setCity}
                  cityId={cityId} setCityId={setCityId}
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
                  location={location} setLocation={setLocation}
                  detectedAddress={detectedAddress}
                  locationStatus={locationStatus} setLocationStatus={setLocationStatus}
                  city={city} setCity={setCity}
                  cityId={cityId} setCityId={setCityId}
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
                  city={city}
                  cityId={cityId}
                  restaurantStatus={restaurantStatus}
                  restaurants={restaurants}
               />
            )}
         />
      </form>
   );
}

export default FoodSearchFilter;