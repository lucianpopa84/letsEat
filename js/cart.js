var detectedDeliveryPlaceText = document.getElementById("detectedDeliveryPlace");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition, showError);
    } else {
        detectedPlaceText.innerHTML = "Geolocation <br> not supported.";
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
            detectedPlaceText.innerHTML = "User denied <br>Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            detectedPlaceText.innerHTML = "Location <br>is unavailable."
            break;
        case error.TIMEOUT:
            detectedPlaceText.innerHTML = "Get location <br>timed out."
            break;
    }
}

function codeLatLng(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // console.log(results)
            if (results) {
                detectedDeliveryPlaceText.innerHTML = "Deliver to:<br>" + results[0].address_components[2].long_name + ",<br>" + results[3].address_components[0].long_name + " " + results[0].address_components[0].long_name;
            } else {
                console.log("No results found");
            }
        } else {
            console.log("Geocoder failed due to: " + status);
        }
    });
}

getLocation();