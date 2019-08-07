import React from "react";

function FoodTypeList() {
   return (
            <div className="foodSearchFilter">
               <input
                  list="foodTypeList"
                  id="foodTypeListInput"
                  placeholder="What do you want to eat today?"
               />
               <datalist id="foodTypeList">
                  <option value="pizza"> </option>
                  <option value="daily menu"> </option>
                  <option value="romanian"> </option>
                  <option value="fast food"> </option>
                  <option value="salads"> </option>
                  <option value="desert"> </option>
               </datalist>

               <i className="fas fa-search" />
            </div>
   );
}

export default FoodTypeList;
