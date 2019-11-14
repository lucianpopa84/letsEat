import React from 'react';
import { NavLink } from 'react-router-dom';

function QuickSearchGrid() {
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
          <img src="/images/foodType/pizza.png" alt="Pizza" />
        </NavLink>
        <NavLink
          to="/food/dailymenu"
          className="quickSearchLink"
          id="quickSearchDailyMenu"
        >
          <div className="foodTitle">
            <p>Daily menu</p>
          </div>
          <img src="/images/foodType/dailyMenu.png" alt="Daily menu" />
        </NavLink>
        <NavLink
          to="/food/romanian"
          className="quickSearchLink"
          id="quickSearchRomanian"
        >
          <div className="foodTitle">
            <p>Romanian</p>
          </div>
          <img src="/images/foodType/romanian.png" alt="Romanian" />
        </NavLink>
        <NavLink
          to="/food/fastfood"
          className="quickSearchLink"
          id="quickSearchFastFood"
        >
          <div className="foodTitle">
            <p>Fast-food</p>
          </div>
          <img src="/images/foodType/fastFood.png" alt="Fast-food" />
        </NavLink>
        <NavLink
          to="/food/salads"
          className="quickSearchLink"
          id="quickSearchSalads"
        >
          <div className="foodTitle">
            <p>Salads</p>
          </div>
          <img src="/images/foodType/salads.png" alt="Salads" />
        </NavLink>
        <NavLink
          to="/food/desert"
          className="quickSearchLink"
          id="quickSearchDesert"
        >
          <div className="foodTitle">
            <p>Desert</p>
          </div>
          <img src="/images/foodType/desert.png" alt="Desert" />
        </NavLink>
      </div>
    </div>
  );
}

export default QuickSearchGrid;
