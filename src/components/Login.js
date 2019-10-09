import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

function Login() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (userName) {
      console.log('User is logged in');
    } else {
      console.log('User is not logged in / user logged out');
    }
  }, [userName]);

  const responseGoogle = (response) => {
    if (response.error) {
      console.log('GAPI response error: ', response.error);
      console.log('GAPI response error details: ', response.details);
    } else {
      console.log('GAPI response: ', response);
      setUserName(response.profileObj.name);
      alert(`Welcome ${response.profileObj.name}!`);
    }
  };

  function manualLogin(e) {
    e.preventDefault();
  }

  return (
    <div className="checkout">
      <h2>Login</h2>
      <h4>Login with Social Media</h4>
      {userName ? (
        <GoogleLogout
          clientId="941236697401-027e46fhlkvteugjumbt3r7al90pnvv5.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={setUserName(null)}
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
        <input type="text" name="username" placeholder="Username" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
