import React from "react";

function RestaurantListItem({ restaurantData }) {
   let currentDate = new Date();
   let currentHour = currentDate.getHours();
   return (
      <div className="restaurantCard" id={`restId${restaurantData.id}`}>
         <div className="row">
            <div className="col-3">
               <div className="card-image">
                  <img
                     src={require(`../images/restaurants/${restaurantData.imageSrc}`)}
                     alt={restaurantData.imageAlt}
                  />
               </div>
            </div>
            <div className="col-4">
               <div className="card-delivery">
                  <h4>{restaurantData.name}</h4>
                  {currentHour < restaurantData.closeHour &&
                  currentHour >= restaurantData.operHour ? (
                     <p>
                        {" "}
                        <i className="fas fa-truck" />{" "}
                        <span className="deliveryTime">
                           {" "}
                           {restaurantData.deliveryTime} min.
                        </span>
                     </p>
                  ) : (
                     <p>
                        {" "}
                        <i className="fas fa-truck" />{" "}
                        <span className="deliveryTime"> closed </span>
                     </p>
                  )}
               </div>
               <div className="card-rating">
                  <span className="fa fa-star checked" />
                  <span className="fa fa-star checked" />
                  <span className="fa fa-star checked" />
                  <span className="fa fa-star" />
                  <span className="fa fa-star" />
               </div>
            </div>
            <div className="col-4">
               <div className="card-pricing">
                  <p> From: {restaurantData.pricingFrom} RON </p>
                  <p> To: {restaurantData.pricingTo} RON </p>
                  <p> Min: {restaurantData.pricingMin} RON </p>
               </div>
            </div>
         </div>
      </div>
   );
}

function RestaurantList({ restaurantStatus, restaurants }) {
   return (
      <div className="flex-container restaurantList" id="restaurantList">
         {restaurantStatus ? <p> {restaurantStatus} </p> : ""}
         {restaurants.map(restaurantData => (
            <RestaurantListItem
               key={restaurantData.id}
               restaurantData={restaurantData}
            />
         ))}
      </div>
   );
}

export default RestaurantList;
