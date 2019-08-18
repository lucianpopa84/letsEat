import React from "react";
import CardRating from "./CardRating";

function RestaurantListItem({ restaurantData }) {
   let currentDate = new Date();
   let currentHour = currentDate.getHours();

   function goToRestaurant(restaurantId) {
      window.location = `/restaurant/${restaurantId}`;
   }

   return (
      <div
         className="restaurantCard"
         id={`restId${restaurantData.id}`}
         onClick={e => {
            goToRestaurant(restaurantData.id);
         }}
      >
         <div className="row">
            <div className="col-3">
               <div className="card-image">
                  <img
                     src={require(`../images/restaurants/${
                        restaurantData.imageSrc
                     }`)}
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
               <CardRating rating={restaurantData.rating} />
            </div>
            <div className="col-4">
               <div className="card-pricing">
                  <p> From: {restaurantData.pricingFrom} € </p>
                  <p> To: {restaurantData.pricingTo} € </p>
                  <p> Min: {restaurantData.pricingMin} € </p>
               </div>
            </div>
         </div>
      </div>
   );
}

function RestaurantList({ restaurantStatus, restaurants }) {
   const pStyle = {
      width: "100%",
      textAlign: "center"
   };
   return (
      <div className="flex-container restaurantList" id="restaurantList">
         {restaurantStatus ? <p style={pStyle}> {restaurantStatus} </p> : ""}
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
