var detectedDeliveryPlaceText = document.getElementById("detectedDeliveryPlace");

function initialize() {
    geocoder = new google.maps.Geocoder();
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition, showError);
    } else {
        detectedDeliveryPlaceText.innerHTML = "Geolocation <br> not supported.";
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    codeLatLng(lat, lng);

}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            detectedDeliveryPlaceText.innerHTML = "User denied <br>Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            detectedDeliveryPlaceText.innerHTML = "Location <br>is unavailable."
            break;
        case error.TIMEOUT:
            detectedDeliveryPlaceText.innerHTML = "Get location <br>timed out."
            break;
    }
}

function codeLatLng(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // console.log(results)
            if (results) {
                if (results[0].address_components[0].types[0] == "street_number"
                    && results[0].address_components[2].types[0] == "locality"
                    && results[0].address_components[1].types[0] == "route") {
                    var streetNumber = results[0].address_components[0].long_name;
                    var locality = results[0].address_components[2].long_name;
                    var street = results[0].address_components[1].long_name;
                    if (street.startsWith("Strada")) {
                        street = `${street.substring(6, street.length)} street`;
                    }
                    detectedDeliveryPlaceText.innerHTML = `Deliver to:<br>
                    ${streetNumber} ${street}, ${locality}`;
                } else {
                    detectedDeliveryPlaceText.innerHTML = `Deliver to:<br>
                    ${results[0].formatted_address.split(",")[0]}, ${results[0].formatted_address.split(",")[1]}`;
                }


            } else {
                console.log("No results found");
            }
        } else {
            console.log("Geocoder failed due to: " + status);
        }
    });
}
