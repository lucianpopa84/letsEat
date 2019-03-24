// ======= geolocation =======
const detectedPlaceText = document.getElementById("detectedPlace");

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
            if (results) {
                if (results[0].address_components[0].types.includes("street_number")
                    && results[0].address_components[2].types.includes("locality")
                    && results[0].address_components[1].types.includes("route")) {
                    var streetNumber = results[0].address_components[0].long_name;
                    var locality = results[0].address_components[2].long_name;
                    localStorage.setItem("locality", locality);
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
        // console.log(this.id);
        renderRestaurantsHtml(this.id);
    });
}

// ======= fetch restaurants json =======
const jsonDataUrl = 'https://lucianpopa84.github.io/letsEat/data/restaurants.json';
fetch(jsonDataUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // console.log(data);
        // localStorage.setItem("restaurantsData", JSON.stringify(data));
        window.restaurantsData = data;
    });

// ======= render restaurants html =======
const restaurantList = document.getElementsByClassName("restaurantList");
function renderRestaurantsHtml(data) {
    // remove previous restaurant cards
    if (document.getElementsByClassName("restaurantCard").length > 0) {
        // console.log(restaurantList[0].firstChild);
        while (restaurantList[0].firstChild) {
            restaurantList[0].removeChild(restaurantList[0].firstChild);
        }
    }
    // generate restaurant cards based on selection
    switch (data) {
        case "quickSearchPizza":
            console.log("Pizza restaurants selected");
            generateRestaurantCards();
            break;
        case "quickSearchDailyMenu":
            console.log("Daily menu restaurants selected");
            break;
        case "quickSearchRomanian":
            console.log("Romanian food restaurants selected");
            break;
        case "quickSearchFastFood":
            console.log("Fast food restaurants selected");
            break;
        case "quickSearchSalads":
            console.log("Salads restaurants selected");
            break;
        case "quickSearchDesert":
            console.log("Desert restaurants selected");
            break;
    }
}

function generateRestaurantCards() {
    if (restaurantsData) {
        let htmlContent = `<div class="flex-container restaurantList"> `;
        // retrieve city from local storage
        let city = localStorage.getItem("locality");
        console.log("city = ", city);
        for (let i = 0; i < restaurantsData.length; i++) {
            if (restaurantsData[i].foodType.includes("pizza")) {
                if (restaurantsData[i].location == city) {
                    htmlContent += `
                    <div class="restaurantCard" id="${restaurantsData[i].id}"> 
                        <div class="row">
                            <div class="col-3">
                                <div class="card-image">
                                    <img src="${restaurantsData[i].imageSrc}" alt="${restaurantsData[i].imageAlt}">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="card-delivery">
                                    <h4>${restaurantsData[i].name}</h4>`;
                    let currentDate = new Date();
                    let currentHour = currentDate.getHours();
                    if (currentHour < restaurantsData[i].closeHour && currentHour > restaurantsData[i].operHour) {
                        htmlContent += `<p> <i class="fas fa-truck"></i> <span class="deliveryTime"> ${restaurantsData[i].deliveryTime} min.</span> </p>`;
                    } else {
                        htmlContent += `<p> <i class="fas fa-truck"></i> <span class="deliveryTime"> closed </span> </p>`;
                    }
                    htmlContent += `</div>
                                <div class="card-rating">`;
                    for (let j = 0; j < restaurantsData[i].rating; j++) {
                        htmlContent += `<span class="fa fa-star checked"></span>`;
                    };
                    for (let j = 0; j < 5 - restaurantsData[i].rating; j++) {
                        htmlContent += `<span class="fa fa-star"></span>`;
                    };
                    htmlContent += `</div>
                            </div>
                            <div class="col-4">
                                <div class="card-pricing">
                                    <p> From: ${restaurantsData[i].pricingFrom} RON </p>
                                    <p> To: ${restaurantsData[i].pricingTo} RON </p>
                                    <p> Min: ${restaurantsData[i].pricingMin} RON </p>
                                </div>
                            </div>
                        </div>
                    </div> `;
                }
            }

        }
        htmlContent += `</div>`;
        restaurantList[0].innerHTML = htmlContent;
    }
}

// ======= add links to logo and menus =======
document.querySelector(".letsEatLogo").addEventListener("click", function(){
    window.location = 'index.html';
});

const topDropdownMenu = document.querySelector(".dropdown-content");
document.querySelector("#topMenu").addEventListener("click", function(){
    if (topDropdownMenu.style.display === "block") {
        topDropdownMenu.style.display = "none";
      } else {
            topDropdownMenu.style.display = "block";
      }
});