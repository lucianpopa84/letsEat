import React from "react";

function FoodTypeList() {
   function goToFoodList(foodType) {
      window.location = `/food/${foodType}`;
   }
   return (
      <div className="foodSearchFilter">
         <input
            list="foodTypeList"
            id="foodTypeListInput"
            placeholder="What do you want to eat today?"
         />
         <datalist id="foodTypeList">
            <option
               value="pizza"
               onClick={e => {goToFoodList("pizza");}}
            />
            <option
               value="daily menu"
               onClick={e => {goToFoodList("dailymenu");}}
            />
            <option
               value="romanian"
               onClick={e => {goToFoodList("romanian");}}
            />
            <option
               value="fast food"
               onClick={e => {goToFoodList("fastfood");}}
            />
            <option
               value="salads"
               onClick={e => {goToFoodList("salads");}}
            />
            <option
               value="desert"
               onClick={e => {goToFoodList("desert");}}
            />
         </datalist>{" "}
         <i className="fas fa-search" />
      </div>
   );
}

export default FoodTypeList;
