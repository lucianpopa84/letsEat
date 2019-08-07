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
      function success(position) {
         let lat = position.coords.latitude;
         let long = position.coords.longitude;
         setLatitude(lat);
         setLongitude(long);
         setLocationStatus("Location detected!");
         // Get address from latidude & longitude.
         Geocode.fromLatLng(latitude, longitude).then(
            response => {
               setDetectedAddress(response.results[0].formatted_address);
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
