import React from 'react';
import { Route } from 'react-router-dom';

function FoodTypeList() {
  let foodTypeList = [
    'pizza',
    'daily menu',
    'romanian',
    'fast food',
    'salads',
    'desert',
    'pasta',
    'greek'
  ];
  function goToFood(e, history) {
    if (foodTypeList.includes(e.target.value)) {
      history.push(`/food/${e.target.value.replace(/\s/g, '')}`);
    }
  }
  return (
    <Route
      render={({ history }) => (
        <div className="foodSearchFilter">
          <input
            list="foodTypeList"
            id="foodTypeListInput"
            placeholder="What do you want to eat today?"
            onChange={e => goToFood(e, history)}
          />
          <datalist id="foodTypeList">
            {foodTypeList.map((foodType, index) => (
              <option value={foodType} key={index} />
            ))}
          </datalist>
        </div>
      )}
    />
  );
}

export default FoodTypeList;
