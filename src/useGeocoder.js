import { useState } from 'react';
import Geocode from 'react-geocode';

function useGeocoder() {
  Geocode.setApiKey('AIzaSyBa5UGUhMpxL9uRc2Hqot8sceXi5A5ohsM');

  let initialLat = '';
  let initialLong = '';

  if (localStorage.getItem('lat') && localStorage.getItem('long')) {
    initialLat = localStorage.getItem('lat');
    initialLong = localStorage.getItem('long');
  } else {
    initialLat = 44.3354258; // Craiova
    initialLong = 23.8167439; // Craiova
  }

  const [address, setAddress] = useState(null);
  const [detectedAddress, setDetectedAddress] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: initialLat,
    long: initialLong
  });
  const [locationStatus, setLocationStatus] = useState('Locating...');
  const [city, setCity] = useState(localStorage.getItem('city') || '');
  const [cityId, setCityId] = useState(null);
  const [detectionEnabled, setDetectionEnabled] = useState(true);
  const [steady, setSteady] = useState(false);

  function getCityId(city) {
    let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/cities?q=${city}`;
    fetch(url)
      .then(response => response.json())
      .then(cityData => {
        if (cityData.length === 1) {
          setCityId(cityData[0].id);
        } else {
          setLocationStatus('Delivery not available for your area');
        }
      })
      .catch(error => console.log('error: ', error.message));
  }

  let streetNumber = '';
  let locality = '';
  let street = '';

  function geoFindMe() {
    function success(position) {
      // set new coordinates and status
      // skip coordinates update if coordinates change less than coordArea parameter
      let coordArea = 0.00001;
      if (
        Math.abs(position.coords.latitude - coordinates.lat) > coordArea ||
        Math.abs(position.coords.longitude - coordinates.long) > coordArea
      ) {
        setCoordinates({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });
        localStorage.setItem('lat', coordinates.lat);
        localStorage.setItem('long', coordinates.long);
      } else setSteady(true); // coordinates changed less than coordArea parameter

      // Get address from latidude & longitude.
      Geocode.fromLatLng(coordinates.lat, coordinates.long).then(
        response => {
          if (response.results) {
            for (let result of response.results) {
              // search for street number
              for (let address_component of result.address_components) {
                if (address_component.types.includes('street_number')) {
                  streetNumber = address_component.long_name;
                  break;
                }
              }
              // search for locality (city)
              for (let address_component of result.address_components) {
                if (address_component.types.includes('locality')) {
                  locality = address_component.long_name;
                  localStorage.setItem('city', locality);
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
                  break;
                }
              }
              // break loop if all address components found
              if (streetNumber && street && locality) {
                setDetectedAddress(`${streetNumber} ${street}, ${locality}`);
                setAddress(detectedAddress);
                setLocationStatus('Detected address:');
                // ======= get city id from json server =======
                getCityId(locality);
                setCity(locality);
                if (steady) {
                  setDetectionEnabled(false);
                } else break;
              } else {
                setDetectedAddress('City not detected.');
                setAddress(detectedAddress);
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

    function error() {
      setLocationStatus('Unable to retrieve your location');
    }

    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 60000
    };

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
