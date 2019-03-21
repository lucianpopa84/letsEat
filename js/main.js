// ======= geolocation =======
var detectedPlaceText = document.getElementById("detectedPlace");

function initialize() {
    geocoder = new google.maps.Geocoder();
    getLocation();
}

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
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // console.log(results);
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
                    detectedPlaceText.innerHTML = `Detected location:<br>
                    ${streetNumber} ${street}, ${locality}`;
                } else {
                    detectedPlaceText.innerHTML = `Detected location:<br>
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

// ======= quick search grid =======
var quickGrid = document.getElementById("foodQuickSearchGrid");
var quickLink = quickGrid.getElementsByClassName("quickSearchLink");
for (var i = 0; i < quickLink.length; i++) {
    quickLink[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
        }
        this.className += " active";
        console.log(this.id);
    });
}

// ======= fetch restaurants json =======
fetch('https://lucianpopa84.github.io/letsEat/data/restaurants.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (restaurantsJson) {
        console.log(JSON.stringify(restaurantsJson));
    });
