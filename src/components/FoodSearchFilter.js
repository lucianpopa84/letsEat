import React from 'react';
import { Route } from 'react-router-dom';
import Address from './Address';
import FoodTypeList from './FoodTypeList';
import QuickSearchGrid from './QuickSearchGrid';
import RestaurantList from './RestaurantList';

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
