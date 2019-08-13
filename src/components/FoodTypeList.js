import React from "react";

function FoodTypeList() {
   function goToFoodList(e) {
      e.preventDefault();
      window.location = `/food/${e.target.value.replace(/\s/g, "")}`;
   }
   return (
      <div className="foodSearchFilter">
         <input
            list="foodTypeList"
            id="foodTypeListInput"
            placeholder="What do you want to eat today?"
            onChange={e => {goToFoodList(e);}}
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
   );
}

export default FoodTypeList;
