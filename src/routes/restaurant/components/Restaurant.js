import React, { useEffect, useState, useContext } from 'react';
import CardRating from '../../../components/CardRating';
import { AppContext } from '../../../AppContext';
import { useSelector, useDispatch } from 'react-redux';

// IMPORT REDUX ACTIONS
// import { addCartItem } from '../../../services/actions/actions'; // REDUX ACTIONS

// IMPORT REDUX ACTIONS VIA TOOLKIT
import { addCartItem } from '../../../services/reducers/cartItemsReducerToolkit'; // REDUX ACTIONS FROM TOOLKIT

function Restaurant({ match }) {
  const { cityId, foodTypeId } = useContext(AppContext);

  const cartItems = useSelector(state => state.cartItems);
  const dispatch = useDispatch();

  const [foodData, setFoodData] = useState([]);
  const [restaurant, setRestaurant] = useState([]);
  const lastCartItemId = Math.max(...cartItems.map(cartItem => cartItem.id), 0); // compute greatest cartItem id
  const [cartItemId, setCartItemId] = useState(lastCartItemId + 1); // set next cartItem id

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
  function getRestaurant(restaurantId) {
    let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/restaurants/${restaurantId}`;
    fetch(url)
      .then(response => response.json())
      .then(restaurantData => {
        setRestaurant(restaurantData);
      });
  }

  function changeQuantity(e, foodItemName) {
    e.preventDefault();
    const newFoodData = [...foodData];
    const index = newFoodData.findIndex(
      foodItem => foodItem.name === foodItemName
    );
    newFoodData[index].quantity = e.target.value;
    newFoodData[index].totalPrice =
      newFoodData[index].quantity * newFoodData[index].price;
    setFoodData(newFoodData);
  }

  function addToCart(e, foodItem, restaurantId) {
    e.preventDefault();

    let newCartItem = {
      foodName: foodItem.name,
      restaurantId: foodItem.restaurantId,
      itemPrice: foodItem.price,
      imageSrc: foodItem.imageSrc,
      imageAlt: foodItem.imageAlt,
      quantity: foodItem.quantity || 1,
      id: cartItemId
    };

    if (foodItem) {
      if (cartItems.length >= 1) {
        // check if item is from different restaurant
        let differentRestaurant = cartItems.findIndex(
          cartItem => cartItem.restaurantId.toString() !== restaurantId
        );
        if (differentRestaurant !== -1) {
          alert(
            'Item is from different restaurant! \nPlease add food from the same restaurant!'
          );
        } else {
          // check if item is already added in cart
          let existingCartItem = cartItems.findIndex(
            cartItem => cartItem.foodName === foodItem.name
          );
          if (existingCartItem !== -1) {
            alert('Food already added in cart!');
          } else { 
            dispatch(addCartItem({ newCartItem }));
            setCartItemId(cartItemId + 1); // increment cartItem id
          }
        }
      } else {
        dispatch(addCartItem({ newCartItem }));
        setCartItemId(cartItemId + 1); // increment cartItem id
      }
    }
  }

  useEffect(() => {
    if (match.params.restaurantId) {
      getRestaurant(match.params.restaurantId);
      getFood(match.params.restaurantId, foodTypeId);
    }
  }, [match.params.restaurantId, foodTypeId, cityId]);

  useEffect(() => {
    // update cart items in localstorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <div>
      <div className="checkout">
        <img
          src={`/images/restaurants/${restaurant.imageSrc}`}
          alt={restaurant.imageAlt}
        />
        <h2>{restaurant.name} menu:</h2>
      </div>
      <div className="flex-container foodList">
        {foodData.map(foodItem => (
          <div className="foodCard" key={foodItem.name}>
            <div className="row">
              <div className="col-4">
                <div className="card-image">
                  <img
                    src={`/images/foodType/${foodItem.imageSrc}`}
                    alt={foodItem.imageAlt}
                  />
                </div>
              </div>
              <div className="col-5">
                <div className="card-delivery">
                  <h4>{foodItem.name}</h4>
                  <p>{foodItem.ingredients}</p>
                </div>
                <CardRating rating={foodItem.rating} />
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
                        addToCart(e, foodItem, match.params.restaurantId)
                      }
                    >
                      {foodItem.totalPrice
                        ? foodItem.totalPrice
                        : foodItem.price}{' '}
                      €
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
