import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
   return (
      <footer>
         <div className="footerNavbar">
            <NavLink to="/add-restaurant">Add a restaurant</NavLink>
            <NavLink to="/how-it-works">How it works</NavLink>
            <NavLink to="/terms">Terms</NavLink>
            <NavLink to="/report-bug">Report bug</NavLink>
         </div>
      </footer>
   );
}

export default Footer;
