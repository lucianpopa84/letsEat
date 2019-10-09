import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import CardRating from './CardRating';

function RestaurantListItem({ restaurantData }) {
  let currentDate = new Date();
  let currentHour = currentDate.getHours();

  return (
    <Route
      render={({ history }) => (
        <div
          className="restaurantCard"
          id={`restId${restaurantData.id}`}
          onClick={() => {
            currentHour < restaurantData.closeHour &&
            currentHour >= restaurantData.operHour
              ? history.push(`/restaurant/${restaurantData.id}`)
              : alert('Restaurant is closed!');
          }}
        >
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
                    <i className="fas fa-truck" />{' '}
                    <span className="deliveryTime">
                      {restaurantData.deliveryTime} min.
                    </span>
                  </p>
                ) : (
                  <p>
                    <i className="fas fa-truck" />{' '}
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
      )}
    />
  );
}

function RestaurantList({
  match,
  restaurantStatus,
  setRestaurantStatus,
  restaurants,
  setRestaurants,
  cityId,
  foodTypeId,
  setFoodTypeId
}) {
  const pStyle = {
    width: '100%',
    textAlign: 'center'
  };

  useEffect(() => {
    function getRestaurantList(cityId, foodTypeId) {
      setRestaurantStatus('Searching for restaurants...');
      // ==== json server call ========
      let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/restaurants?cityId=${cityId}&foodTypeId=${foodTypeId}`;
      fetch(url)
        .then(response => response.json())
        .then(restaurantsData => {
          if (restaurantsData.length >= 1) {
            if (restaurantsData.length === 1) {
              setRestaurantStatus(`1 restaurant found!`);
            } else {
              setRestaurantStatus(
                `${restaurantsData.length} restaurants found!`
              );
            }
            setRestaurants(restaurantsData);
          } else {
            setRestaurantStatus('No restaurants found!');
            setRestaurants([]);
          }
        })
        .catch(error => console.log('error: ', error.message));
    }

    if (cityId && foodTypeId) {
      getRestaurantList(cityId, foodTypeId);
    }
  }, [cityId, foodTypeId, setRestaurantStatus, setRestaurants]);

  useEffect(() => {
    // ======= get food type id from json server =======
    function getFoodTypeId(food) {
      let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/foodType?q=${food}`;
      fetch(url)
        .then(response => response.json())
        .then(foodTypeData => {
          if (foodTypeData.length === 1) {
            setFoodTypeId(foodTypeData[0].id);
            localStorage.setItem('foodTypeId', foodTypeId);
          }
        })
        .catch(error => console.log('error: ', error.message));
    }

    if (match.params.foodType != null) {
      getFoodTypeId(match.params.foodType);
    }
  }, [match.params.foodType, foodTypeId, setFoodTypeId]);

  return (
    <div className="flex-container restaurantList" id="restaurantList">
      {restaurantStatus ? <p style={pStyle}> {restaurantStatus} </p> : ''}
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
