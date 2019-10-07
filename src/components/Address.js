import React, { useEffect } from 'react';

function Address({
  address,
  setAddress,
  detectedAddress,
  detectionEnabled,
  setDetectionEnabled,
  locationStatus,
  setLocationStatus,
  setCity,
  getCityId,
  geoFindMe,
}) {
  let cityDeliveryList = ['Craiova', 'Brasov', 'Cluj-Napoca'];

  useEffect(() => {
    geoFindMe();
  }, [detectedAddress, detectionEnabled]);

  return (
    <div className="addressForm">
      <div className="flex-container">
        <i
          className="fas fa-map-marker-alt"
          onClick={() => {
            setDetectionEnabled(true);
            geoFindMe();
          }}
        />
        {address ? (
          <p id="detectedPlace">
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
            let processedInput = '';
            if (e.target.value.length > 1) {
              processedInput =
                e.target.value[0].toUpperCase() +
                e.target.value.slice(1).toLowerCase(); // convert input string to sentence case 
              if (cityDeliveryList.includes(processedInput)) {
                setAddress(processedInput);
                setCity(processedInput);
                getCityId(processedInput);
                localStorage.setItem('city', processedInput);
                e.target.value = '';
                setLocationStatus('Selected address:');
              } else if (cityDeliveryList.includes(e.target.value)) {
                setAddress(e.target.value);
                setCity(e.target.value);
                getCityId(e.target.value);
                localStorage.setItem('city', e.target.value);
                e.target.value = '';
                setLocationStatus('Selected address:');
              }
            }
          }}
        />
        <datalist id="cityDeliveryList">
          {cityDeliveryList.map((city, index) => (
            <option value={city} key={index} />
          ))}
        </datalist>
      </div>
    </div>
  );
}

export default Address;
