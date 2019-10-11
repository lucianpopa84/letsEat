import React, { useEffect, useContext } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { AppContext } from '../AppContext';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

function Login() {
  const { userData, setUserData } = useContext(AppContext);

  useEffect(() => {
    if (userData.name) {
      console.log(`User ${userData.name} is logged in`);
    } else {
      console.log('User is not logged in / user logged out');
    }
  }, [userData.name]);

  const responseGoogle = response => {
    if (response.error) {
      console.log('GAPI response error: ', response.error);
      console.log('GAPI response error details: ', response.details);
    } else {
      console.log('GAPI response: ', response);
      setUserData({
        name: response.profileObj.name,
        imgUrl: response.profileObj.imageUrl
      });
      localStorage.setItem(
        'userData',
        JSON.stringify({
          name: response.profileObj.name,
          imgUrl: response.profileObj.imageUrl
        })
      );
      alert(`Welcome ${response.profileObj.name}!`);
      history.push('/');
    }
  };

  function manualLogin(e) {
    e.preventDefault();
  }

  return (
    <div className="checkout">
      <h2>Login</h2>
      <div className="loginForm">
        <h4>Login with Social Media</h4>
        {userData.name ? (
          <GoogleLogout
            clientId="941236697401-027e46fhlkvteugjumbt3r7al90pnvv5.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={() => {
              alert(`${userData.name} logged out!`);
              setUserData({
                name: null,
                imgUrl: null
              });
              localStorage.setItem('userData', JSON.stringify(userData));
              history.push('/');
            }}
            onFailure={responseGoogle}
          ></GoogleLogout>
        ) : (
          <GoogleLogin
            clientId="941236697401-027e46fhlkvteugjumbt3r7al90pnvv5.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        )}
        <br />
        <form onSubmit={e => manualLogin(e)}>
          <h4>Or login manually</h4>
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            name="userData"
            id="userName"
            placeholder="type your username..."
            required
          />
          <label htmlFor="userPassword">Password</label>
          <input
            type="password"
            id="userPassword"
            name="password"
            placeholder="type your password..."
            required
          />
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
}

export default Login;
