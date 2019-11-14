import React from 'react';
import { Route } from 'react-router-dom';
import Address from './FoodSearchFilter/Address';
import FoodTypeList from './FoodSearchFilter/FoodTypeList';
import QuickSearchGrid from './FoodSearchFilter/QuickSearchGrid';
import RestaurantList from '../routes/food/components/RestaurantList';

function FoodSearchFilter() {
  return (
    <form id="FoodSearchFilter">
      <Route
        exact
        path="/"
        render={() => (
          <>
            <Address />
            <FoodTypeList />
            <QuickSearchGrid />
          </>
        )}
      />
      <Route
        path="/food/:foodType"
        render={props => (
          <>
            <Address />
            <FoodTypeList />
            <QuickSearchGrid />
            <RestaurantList {...props} />
          </>
        )}
      />
    </form>
  );
}

export default FoodSearchFilter;
