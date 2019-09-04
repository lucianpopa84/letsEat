import React, { useEffect } from "react";

function Login() {
   function onSignIn(googleUser) {
      // Useful data for your client-side scripts:
      var profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId()); // Don't send this directly to your server!
      console.log("Full Name: " + profile.getName());
      console.log("Given Name: " + profile.getGivenName());
      console.log("Family Name: " + profile.getFamilyName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail());
   }
   function manualLogin(e) {
      e.preventDefault();
   }

   return (
      <div className="checkout">
         <h2>Login</h2>
         <h4>Login with Social Media</h4>
         <form onSubmit={e => manualLogin(e)}>
            <div className="g-signin2" data-onsuccess="onSignIn" />
            <br />
            <h4>Or login manually</h4>
            <input
               type="text"
               name="username"
               placeholder="Username"
               required
            />
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
