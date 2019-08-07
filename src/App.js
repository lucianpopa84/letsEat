import React from "react";
import Topnav from "./components/Topnav";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import About from "./components/About";
import Contact from "./components/Contact";
import Address from "./components/Address";
import { BrowserRouter as Router, Route } from "react-router-dom";
import FoodTypeList from "./components/FoodTypeList";
import QuickSearchGrid from "./components/QuickSearchGrid";

function App() {
   return (
      <Router>
         <Route path="/" component={Topnav} />
         <Route path="/cart" component={Cart} />
         <Route path="/about" component={About} />
         <Route path="/contact" component={Contact} />
         <form id="FoodSearchFilter">
            <Route exact path="/" component={Address} />
            <Route exact path="/" component={FoodTypeList} />
            <Route exact path="/" component={QuickSearchGrid} />
            <Route path="/food/:foodType" component={Address} />
            <Route path="/food/:foodType" component={FoodTypeList} />
            <Route path="/food/:foodType" component={QuickSearchGrid} />
         </form>
         <Route path="/" component={Footer} />
      </Router>
   );
}

export default App;
