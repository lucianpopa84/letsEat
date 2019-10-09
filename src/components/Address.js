import React from 'react';

function Address({
  address,
  setAddress,
  locationStatus,
  setLocationStatus,
  setCity,
  geoFindMe,
  setDetectionEnabled
}) {
  let cityDeliveryList = ['Craiova', 'Brasov', 'Cluj-Napoca'];

  function onAddressChange(e) {
    let processedInput = '';
    if (e.target.value.length > 1) {
      processedInput =
        e.target.value[0].toUpperCase() + e.target.value.slice(1).toLowerCase(); // convert input string to sentence case
      if (cityDeliveryList.includes(processedInput)) {
        setAddress(processedInput);
        setCity(processedInput);
        localStorage.setItem('city', processedInput);
        e.target.value = '';
        setLocationStatus('Selected address:');
      } else if (cityDeliveryList.includes(e.target.value)) {
        setAddress(e.target.value);
        setCity(e.target.value);
        localStorage.setItem('city', e.target.value);
        e.target.value = '';
        setLocationStatus('Selected address:');
      }
    }
  }

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
          onChange={e => onAddressChange(e)}
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
