import React from "react";
import { NavLink } from "react-router-dom";
import imgPizza from "../images/foodType/pizza.png";
import imgDailyMenu from "../images/foodType/dailyMenu.png";
import imgRomanian from "../images/foodType/romanian.png";
import imgFastFood from "../images/foodType/fastFood.png";
import imgSalads from "../images/foodType/salads.png";
import imgDesert from "../images/foodType/desert.png";

function QuickSearchGrid({match}) {
    match.params.foodType? console.log(match.params.foodType): console.log('home');
   return (
      <div className="quickSearchGrid" id="foodQuickSearchGrid">
         <div className="flex-container">
            <NavLink
              to="/food/pizza"
               className="quickSearchLink"
               id="quickSearchPizza"
            >
               <div className="foodTitle">
                  <p>Pizza</p>
               </div>
               <img src={imgPizza} alt="Pizza" />
            </NavLink>
            <NavLink
               to="/food/dailymenu"
               className="quickSearchLink"
               id="quickSearchDailyMenu"
            >
               <div className="foodTitle">
                  <p>Daily menu</p>
               </div>
               <img src={imgDailyMenu} alt="Daily menu" />
            </NavLink>
            <NavLink
               to="/food/romanian"
               className="quickSearchLink"
               id="quickSearchRomanian"
            >
               <div className="foodTitle">
                  <p>Romanian</p>
               </div>
               <img src={imgRomanian} alt="Romanian" />
            </NavLink>
            <NavLink
               to="/food/fastfood"
               className="quickSearchLink"
               id="quickSearchFastFood"
            >
               <div className="foodTitle">
                  <p>Fast-food</p>
               </div>
               <img src={imgFastFood} alt="Fast-food" />
            </NavLink>
            <NavLink
               to="/food/salads"
               className="quickSearchLink"
               id="quickSearchSalads"
            >
               <div className="foodTitle">
                  <p>Salads</p>
               </div>
               <img src={imgSalads} alt="Salads" />
            </NavLink>
            <NavLink
               to="/food/desert"
               className="quickSearchLink"
               id="quickSearchDesert"
            >
               <div className="foodTitle">
                  <p>Desert</p>
               </div>
               <img src={imgDesert} alt="Desert" />
            </NavLink>
         </div>
      </div>
   );
}

export default QuickSearchGrid;
