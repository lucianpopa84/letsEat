import React, { useEffect } from "react";
import useGeocoder from "../useGeocoder";

function Address() {
   const {
      address,
      detectedAddress,
      setAddress,
      locationStatus,
      geoFindMe
   } = useGeocoder();

   useEffect(() => {
      geoFindMe();
   }, [detectedAddress]);

   return (
      <div className="addressForm">
         <div className="flex-container">
            <i className="fas fa-map-marker-alt" onClick={() => geoFindMe()} />
            {address ? (
               <p id="detectedPlace"> {address}</p>
            ) : (
               <p id="detectedPlace">{locationStatus}</p>
            )}
            <input
               list="cityDeliveryList"
               id="cityDeliveryListInput"
               name="City"
               placeholder="Change address"
               onChange={e =>
                  setAddress(`Selected location: ${e.target.value}`)
               }
               onClick={e => (e.target.value = "")}
            />
            <datalist id="cityDeliveryList">
               <option value="Craiova"> </option>
               <option value="Brasov"> </option>
               <option value="Cluj-Napoca"> </option>
            </datalist>
         </div>
      </div>
   );
}

export default Address;
