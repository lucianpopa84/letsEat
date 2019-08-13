import React, { useEffect, useState } from "react";

function Restaurant({ match, foodTypeId, cityId, cartItems, setCartItems }) {
   const [foodData, setFoodData] = useState([]);
   const [restaurantName, setRestaurantName] = useState("");

   // get restaurant food from json server
   function getFood(restaurantId, foodTypeId) {
      let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/food/?restaurantId=${restaurantId}&foodTypeId=${foodTypeId}`;
      fetch(url)
         .then(response => response.json())
         .then(foodData => {
            setFoodData(foodData);
         });
   }

   // get restaurant name from json server
   function getRestaurantName(restaurantId) {
      let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/restaurants/${restaurantId}`;
      fetch(url)
         .then(response => response.json())
         .then(restaurantData => {
            setRestaurantName(restaurantData.name);
         });
   }

   function changeQuantity(e, foodItemName) {
      e.preventDefault();
      // work in progress
      console.log("e.target.value:", e.target.value, "foodItemName:", foodItemName);
      const newFoodData = [...foodData];
      const index = newFoodData.findIndex(
         foodItem => foodItem.name === foodItemName
      );
      newFoodData[index].quantity = e.target.value;
      newFoodData[index].totalPrice = newFoodData[index].quantity * newFoodData[index].price;
      setFoodData(newFoodData);
   }

   function addToCart(e, foodItem) {
    e.preventDefault();
    if (foodItem) {
      if (cartItems.length >= 1) {
        let foodItemId = cartItems.findIndex(
          cartItem => cartItem.foodName === foodItem.name
        );
        if (foodItemId !== -1) {
          alert("Food item already in cart!");
        } else {
          setCartItems([
            ...cartItems,
            {
              foodName: foodItem.name,
              restaurantId: foodItem.restaurantId,
              itemPrice: foodItem.price,
              imageSrc: foodItem.imageSrc,
              imageAlt: foodItem.imageAlt,
              quantity: foodItem.quantity || 1
            }
          ]);
        }
      } else {
        setCartItems([
          {
            foodName: foodItem.name,
            restaurantId: foodItem.restaurantId,
            itemPrice: foodItem.price,
            imageSrc: foodItem.imageSrc,
            imageAlt: foodItem.imageAlt,
            quantity: foodItem.quantity || 1
          }
        ]);
      }
    }
  }

   useEffect(() => {
      if (match.params.restaurantId) {
         getRestaurantName(match.params.restaurantId);
         getFood(match.params.restaurantId, foodTypeId);
      }
   }, [match.params.restaurantId, foodTypeId, cityId]);

   return (
      <div>
         <div className="checkout">
            <h2>{restaurantName}</h2>
         </div>
         <div className="flex-container foodList">
            {foodData.map(foodItem => (
               <div className="foodCard" key={foodItem.name}>
                  <div className="row">
                     <div className="col-4">
                        <div className="card-image">
                           <img
                              src={require(`../images/foodType/${foodItem.imageSrc}`)}
                              alt={foodItem.imageAlt}
                           />
                        </div>
                     </div>
                     <div className="col-5">
                        <div className="card-delivery">
                           <h4>{foodItem.name}</h4>
                           <p>{foodItem.ingredients}</p>
                        </div>
                        <div className="card-rating" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                     </div>
                     <div className="col-3">
                        <div className="card-pricing">
                           <form className="priceForm">
                              <input
                                 type="number"
                                 name="quantity"
                                 min="1"
                                 max="10"
                                 value={foodItem.quantity ? foodItem.quantity : 1}
                                 className="quantityInput"
                                 onChange={e => changeQuantity(e, foodItem.name)}
                              />
                              <button
                                 className="priceButton"
                                 onClick={e =>
                                    addToCart(
                                       e,
                                       foodItem,
                                       match.params.restaurantId
                                    )
                                 }
                              >
                                 {foodItem.totalPrice? foodItem.totalPrice : foodItem.price} €{" "}
                                 <i className="fa fa-shopping-cart" />
                              </button>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default Restaurant;
