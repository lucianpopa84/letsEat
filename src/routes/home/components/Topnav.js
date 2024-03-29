import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../../AppContext';
import { useSelector } from 'react-redux';

function Topnav() {
  const { userData } = useContext(AppContext);

  const cartItems = useSelector(state => state.cartItems);
  const [cartItemsNumber, setCartItemsNumber] = useState(
    cartItems.reduce((total, cartItem) => {
      return total + parseFloat(cartItem.quantity);
    }, 0)
  );

  const userImgStyle = {
    height: '22px',
    textAlign: 'center',
    float: 'left'
  };

  function toggleMenu(event, position) {
    let element = null;
    switch (position) {
      case 1:
        element = event.target.nextElementSibling;
        break;
      case 2:
        element = event.target.parentElement.nextElementSibling;
        break;
      case 3:
        element =
          event.target.parentElement.parentElement.parentElement.parentElement;
        break;
      default:
    }

    if (element) {
      if (element.style.display === 'block') {
        element.style.display = 'none';
      } else {
        element.style.display = 'block';
      }
    }
  }

  useEffect(() => {
    setCartItemsNumber(
      cartItems.reduce((total, cartItem) => {
        return total + parseFloat(cartItem.quantity);
      }, 0)
    );
  }, [cartItems]);

  return (
    <div>
      <div className="topnav">
        <button
          id="topMenu"
          className="dropdown"
          onClick={e => toggleMenu(e, 1)}
        >
          <i
            className="fas fa-bars"
            id="topMenuIcon"
            onClick={e => toggleMenu(e, 2)}
          />
        </button>
        <div className="dropdown-content">
          <nav id="topMenu">
            <ul>
              <li>
                <NavLink
                  exact
                  to="/"
                  id="topMenuHome"
                  onClick={e => toggleMenu(e, 3)}
                >
                  <i className="fas fa-home"> </i> Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  id="topMenuAbout"
                  onClick={e => toggleMenu(e, 3)}
                >
                  <i className="far fa-question-circle"> </i> About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  id="topMenuContact"
                  onClick={e => toggleMenu(e, 3)}
                >
                  <i className="far fa-address-card" /> Contact
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div id="topnav-right">
          <NavLink to="/login">
            {userData.imgUrl ? (
              <img
                src={userData.imgUrl}
                alt="user avatar"
                style={userImgStyle}
              />
            ) : (
              <i className="fas fa-user-circle"> </i>
            )}
          </NavLink>
          <NavLink to="/cart" id="cartButton">
            <i className="fas fa-shopping-cart" />
          </NavLink>
          <span className="cartItems">
            {cartItemsNumber !== 0 ? cartItemsNumber : ''}
          </span>
        </div>
      </div>
      <NavLink to="/">
        <div className="letsEatLogo" />
      </NavLink>
    </div>
  );
}

export default Topnav;
