import React from "react";
import Topnav from "./components/Topnav";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import About from "./components/About";
import Contact from "./components/Contact";
import Address from "./components/Address";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
   return (
      <Router>
         <Route path="/" component={Topnav} />
         <Route path="/cart" component={Cart} />
         <Route path="/about" component={About} />
         <Route path="/contact" component={Contact} />
         <Route exact path="/" component={Address} />
         <Route path="/" component={Footer} />
      </Router>
   );
}

export default App;
