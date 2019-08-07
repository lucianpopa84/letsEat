import { useState } from "react";
import Geocode from "react-geocode";

function useGeocoder() {
   Geocode.setApiKey("AIzaSyBa5UGUhMpxL9uRc2Hqot8sceXi5A5ohsM");
   const [address, setAddress] = useState(
      JSON.parse(localStorage.getItem("address")) || []
   );
   const [detectedAddress, setDetectedAddress] = useState(
      JSON.parse(localStorage.getItem("address")) || []
   );
   const [locationStatus, setLocationStatus] = useState("Locating...");
   const [latitude, setLatitude] = useState(44.3354258);
   const [longitude, setLongitude] = useState(23.8167439);

   function geoFindMe() {
      let streetNumber = "";
      let locality = "";
      let street = "";
      function success(position) {
         let lat = position.coords.latitude;
         let long = position.coords.longitude;
         setLatitude(lat);
         setLongitude(long);
         setLocationStatus("Location detected!");
         // Get address from latidude & longitude.
         Geocode.fromLatLng(latitude, longitude).then(
            response => {
               if (response.results) {
                  for (let result of response.results) {
                     // search for street number
                     for (let address of result.address_components) {
                        if (address.types.includes("street_number")) {
                           console.log(
                              "Street number results:",
                              address.long_name
                           );
                           streetNumber = address.long_name;
                           break;
                        }
                     }
                     // search for locality (city)
                     for (let address of result.address_components) {
                        if (address.types.includes("locality")) {
                           console.log("Locality results:", address.long_name);
                           locality = address.long_name;
                           localStorage.setItem("locality", locality);
                           break;
                        }
                     }
                     // search for route (street)
                     for (let address of result.address_components) {
                        if (address.types.includes("route")) {
                           console.log("Route results:", address.long_name);
                           street = address.long_name;
                           if (
                              document.documentElement.lang.toLowerCase() ===
                              "en"
                           ) {
                              // cut "Strada" from street and add "street" in the end, if language is english
                              if (street.startsWith("Strada")) {
                                 street = `${street.substring(
                                    6,
                                    street.length
                                 )} street`;
                              }
                              // cut "Bulevardul" from street and add "boulevard" in the end, if language is english
                              if (street.startsWith("Bulevardul")) {
                                 street = `${street.substring(
                                    10,
                                    street.length
                                 )} boulevard`;
                              }
                           }
                           break;
                        }
                     }
                     // break loop if all address components found
                     if (streetNumber && street && locality) {
                        setDetectedAddress(
                           `${streetNumber} ${street}, ${locality}`
                        );
                        // getCityId(locality);
                        break;
                     } else {
                        setDetectedAddress(
                           `${response.results[0].formatted_address.split(",")[0]},
                            ${response.results[0].formatted_address.split(",")[1]}
                            Delivery not available for your area`
                        );
                     }
                  }
               } else {
                  console.log("No results found");
               }
               setAddress(`Detected location: ${detectedAddress}`);
            },
            error => {
               setLocationStatus(error);
            }
         );
      }

      function error() {
         setLocationStatus("Unable to retrieve your location");
      }

      if (!navigator.geolocation) {
         setLocationStatus("Geolocation is not supported by your browser");
      } else {
         navigator.geolocation.getCurrentPosition(success, error);
      }
   }

   return {
      address,
      setAddress,
      detectedAddress,
      locationStatus,
      geoFindMe
   };
}
export default useGeocoder;
