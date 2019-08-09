import React, { useEffect } from "react";

function Address({
   address,
   setAddress,
   detectedAddress,
   locationStatus,
   setLocationStatus,
   setCity,
   getCityId,
   geoFindMe
}) {
   useEffect(() => {
      geoFindMe();
   }, [detectedAddress]);

   return (
      <div className="addressForm">
         <div className="flex-container">
            <i className="fas fa-map-marker-alt" onClick={() => geoFindMe()} />
            {address ? (
               <p id="detectedPlace">
                  {" "}
                  {locationStatus} <br /> {address}
               </p>
            ) : (
               <p id="detectedPlace">{locationStatus}</p>
            )}
            <input
               list="cityDeliveryList"
               id="cityDeliveryListInput"
               name="City"
               placeholder="Change address"
               onChange={e => {
                  setAddress(e.target.value);
                  setCity(e.target.value);
                  getCityId(e.target.value);
                  localStorage.setItem("city", e.target.value);
                  e.target.value = "";
                  setLocationStatus("Selected address:");
               }}
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
