import { useState } from 'react';
import Geocode from 'react-geocode';

let initialLat = '';
let initialLong = '';
let streetNumber = '';
let locality = '';
let street = '';

function useGeocoder() {
  Geocode.setApiKey('AIzaSyBa5UGUhMpxL9uRc2Hqot8sceXi5A5ohsM');

  const [address, setAddress] = useState(null); // current address
  const [detectedAddress, setDetectedAddress] = useState(null); // detected geocoder address
  const [coordinates, setCoordinates] = useState({
    lat: initialLat,
    long: initialLong
  });
  const [locationStatus, setLocationStatus] = useState('Locating...');
  const [city, setCity] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [detectionEnabled, setDetectionEnabled] = useState(true); // enable/disable detection
  const [steady, setSteady] = useState(false); // user does not leave the <coordArea> area

  // ======= get city id from json server =======
  function getCityId(city) {
    if (city) {
      let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/cities?q=${city}`;
      fetch(url)
        .then(response => response.json())
        .then(cityData => {
          if (cityData.length === 1) {
            setCityId(cityData[0].id);
            localStorage.setItem('cityId', cityId);
          } else {
            setLocationStatus('Delivery not available for your area');
          }
        })
        .catch(error => console.log('error: ', error.message));
    }
  }

  function geoFindMe() {
    // define geolocation options
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 60000
    };

    function success(position) {
      // set new coordinates and status
      // skip coordinates update if coordinates change less than coordArea parameter
      let coordArea = 0.0002;
      if (
        Math.abs(position.coords.latitude - coordinates.lat) > coordArea ||
        Math.abs(position.coords.longitude - coordinates.long) > coordArea
      ) {
        setCoordinates({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });
        localStorage.setItem('lat', position.coords.latitude);
        localStorage.setItem('long', position.coords.longitude);
      } else setSteady(true); // coordinates changed less than coordArea parameter

      if (coordinates.lat && coordinates.long) {
        // Get address from latidude & longitude.
        Geocode.fromLatLng(coordinates.lat, coordinates.long).then(
          response => {
            if (response.results) {
              for (let result of response.results) {
                // search for street number
                for (let address_component of result.address_components) {
                  if (address_component.types.includes('street_number')) {
                    if (!isNaN(address_component.long_name)) {
                      streetNumber = address_component.long_name;
                      localStorage.setItem('streetNumber', streetNumber);
                      break;
                    }
                  }
                }
                // search for locality (city)
                for (let address_component of result.address_components) {
                  if (address_component.types.includes('locality')) {
                    locality = address_component.long_name;
                    break;
                  }
                }
                // search for route (street)
                for (let address_component of result.address_components) {
                  if (address_component.types.includes('route')) {
                    street = address_component.long_name;
                    if (document.documentElement.lang.toLowerCase() === 'en') {
                      // cut "Strada" from street and add "street" in the end, if language is english
                      if (street.startsWith('Strada')) {
                        street = `${street.substring(6, street.length)} street`;
                      }
                      // cut "Bulevardul" from street and add "boulevard" in the end, if language is english
                      if (street.startsWith('Bulevardul')) {
                        street = `${street.substring(
                          10,
                          street.length
                        )} boulevard`;
                      }
                    }
                    localStorage.setItem('street', street);
                    break;
                  }
                }
                // break loop if all address components found
                if (streetNumber && street && locality) {
                  setDetectedAddress(`${streetNumber} ${street}, ${locality}`);
                  setAddress(`${streetNumber} ${street}, ${locality}`);
                  setLocationStatus('Detected address:');
                  setCity(locality);
                  localStorage.setItem('city', locality);
                  if (steady) {
                    setDetectionEnabled(false);
                  }
                  break;
                } else {
                  setAddress('City not detected.');
                  setDetectedAddress('City not detected.');
                  setLocationStatus('Please select a city from list!');
                }
              }
            } else {
              setLocationStatus('No results found');
            }
          },
          error => {
            setLocationStatus(error);
          }
        );
      }
    }

    function error() {
      setLocationStatus('Unable to retrieve your location');
    }

    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
    } else if (detectionEnabled) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }
  }

  return {
    address,
    setAddress,
    detectedAddress,
    locationStatus,
    setLocationStatus,
    city,
    setCity,
    cityId,
    setCityId,
    getCityId,
    locality,
    geoFindMe,
    detectionEnabled,
    setDetectionEnabled
  };
}
export default useGeocoder;
