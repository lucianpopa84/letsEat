import React, { useEffect, useContext } from 'react';
import { AppContext } from '../../../AppContext';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeCartItem,
  updateCartItem
} from '../../../services/actions/actions'; // REDUX ACTIONS

function Cart() {
  const {
    address,
    setAddress,
    setDetectionEnabled,
    locationStatus,
    setLocationStatus,
    geoFindMe
  } = useContext(AppContext);

  const cartItems = useSelector(state => state.cartItems);
  const dispatch = useDispatch();

  // compute total price
  let totalPrice = 0;
  if (cartItems.length >= 1) {
    totalPrice = cartItems.reduce((total, cartItem) => {
      return total + cartItem.quantity * parseFloat(cartItem.itemPrice);
    }, 0);
  }

  let deleteCharacter = '\u2717';

  useEffect(() => {
    // update cart items in localstorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  function onDeliveryAddressChange(e) {
    if (locationStatus === 'Delivery not available for your area') {
      setAddress(`Selected delivery address: ${e.target.value}`);
    } else {
      setAddress(e.target.value);
      setLocationStatus('Selected delivery address:');
    }
  }

  function submitOrder(e) {
    // work in progress
    e.preventDefault();
  }

  function nameChange(e) {
    // work in progress
    e.preventDefault();
  }

  function phoneChange(e) {
    // work in progress
    e.preventDefault();
  }

  function timeChange(e) {
    // work in progress
    e.preventDefault();
  }

  return (
    <div>
      <div className="checkout">
        <h2>Cart</h2>
      </div>

      <div className="foodList">
        <div className="flex-container">
          {cartItems.map(cartItem => (
            <div key={cartItem.foodName} className="foodCard">
              <div className="row">
                <div className="col-3">
                  <div className="card-image">
                    <img
                      src={`/images/foodType/${cartItem.imageSrc}`}
                      alt={cartItem.imageAlt}
                    />
                  </div>
                </div>
                <div className="col-3">
                  <div className="card-delivery">
                    <h4 className="foodName">{cartItem.foodName}</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card-pricing">
                    <form className="priceForm">
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        max="10"
                        value={cartItem.quantity}
                        className="cartQuantityInput"
                        onChange={e => dispatch(updateCartItem(e, cartItem))}
                      />
                      <input
                        type="button"
                        value={deleteCharacter}
                        onClick={() => dispatch(removeCartItem(cartItem))}
                      />
                    </form>
                  </div>
                </div>
                <div className="col-2">
                  <p className="price">
                    {cartItem.itemPrice * cartItem.quantity} €
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="total">
        <h2 id="totalPrice">Total = {totalPrice} €</h2>
      </div>
      <div className="checkoutForm">
        <form id="checkoutForm" onSubmit={e => submitOrder(e)}>
          <div className="checkoutAddress flex-container">
            <i
              className="fas fa-map-marker-alt"
              onClick={() => {
                setDetectionEnabled(true);
                geoFindMe();
              }}
            />
            {address ? (
              <p id="detectedDeliveryPlace">
                {locationStatus} <br /> {address}
              </p>
            ) : (
              <p id="detectedPlace">{locationStatus}</p>
            )}
            <input
              name="address"
              id="manualAddress"
              autoComplete="address-level2"
              placeholder="Change address"
              onChange={e => onDeliveryAddressChange(e)}
              onClick={e => {
                e.target.value = '';
              }}
            />
          </div>

          <label htmlFor="clientName">Name </label>
          <input
            type="text"
            id="clientName"
            name="name"
            placeholder="Enter your name"
            autoComplete="name"
            required
            onChange={e => nameChange(e)}
          />

          <label htmlFor="clientPhone">Phone </label>
          <input
            type="tel"
            id="clientPhone"
            name="phone"
            placeholder="Enter phone number"
            autoComplete="tel"
            required
            onChange={e => phoneChange(e)}
          />

          <label htmlFor="deliveryTime">Preferred delivery time:</label>
          <input
            type="time"
            id="deliveryTime"
            min="11:00"
            max="21:00"
            step="900"
            value="12:30"
            name="delivery"
            onChange={e => timeChange(e)}
          />

          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            style={{ height: '100px' }}
            maxLength={1000}
            placeholder="Delivery instructions:"
          />
          <input
            type="submit"
            value="Submit order"
            onClick={e => {
              totalPrice ? alert('Order placed!') : alert('No items in cart!');
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default Cart;
