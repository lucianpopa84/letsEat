import React from "react";
import { Route } from "react-router-dom";

function FoodTypeList() {
   return (
      <Route
      render={({ history }) => (
      <div className="foodSearchFilter">
         <input
            list="foodTypeList"
            id="foodTypeListInput"
            placeholder="What do you want to eat today?"
            onChange={e => {history.push(`/food/${e.target.value.replace(/\s/g, "")}`);}}
         />
         <datalist id="foodTypeList">
            <option value="pizza" />
            <option value="daily menu" />
            <option value="romanian" />
            <option value="fast food" />
            <option value="salads" />
            <option value="desert" />
            <option value="pasta" />
            <option value="greek" />
         </datalist>{" "}
         <i className="fas fa-search" />
      </div>
      )}
      />
   );
}

export default FoodTypeList;
