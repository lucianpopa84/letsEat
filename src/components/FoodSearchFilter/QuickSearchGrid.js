import React from 'react';
import { NavLink } from 'react-router-dom';
import { quickSearchLinkData } from '../../services/data/quickSearchLinkData';

function QuickSearchGrid() {
  return (
    <div className="quickSearchGrid" id="foodQuickSearchGrid">
      <div className="flex-container">
        {quickSearchLinkData.map(quickSearchLink => (
          <NavLink
            to={`/food/${quickSearchLink.link}`}
            className="quickSearchLink"
            key={quickSearchLink.link}
          >
            <div className="foodTitle">
              <p>{quickSearchLink.imgAlt}</p>
            </div>
            <img
              src={`/images/foodType/${quickSearchLink.imgSrc}`}
              alt={quickSearchLink.imgAlt}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default QuickSearchGrid;
