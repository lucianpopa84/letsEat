// ======= google geolocation =======
const detectedPlaceText = document.querySelector("#detectedPlace");

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
    // get latitude and longitude
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    // get location components (city, street, etc.) based on latitude and longitude
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
                for (let result of results) {
                    // search for street number
                    for (let address of result.address_components) {
                        if (address.types.includes("street_number")) {
                            console.log("Street number results:", address.long_name);
                            var streetNumber = address.long_name;
                            break;
                        }
                    }
                    // search for locality (city)
                    for (let address of result.address_components) {
                        if (address.types.includes("locality")) {
                            console.log("Locality results:", address.long_name);
                            var locality = address.long_name;
                            localStorage.setItem("locality", locality);
                            break;
                        }
                    }
                    // search for route (street)
                    for (let address of result.address_components) {
                        if (address.types.includes("route")) {
                            console.log("Route results:", address.long_name);
                            var street = address.long_name;
                            if ( document.documentElement.lang.toLowerCase() === "en-us" ) {
                                // cut "Strada" from street and add "street" in the end, if language is english
                                if (street.startsWith("Strada")) {
                                    street = `${street.substring(6, street.length)} street`;
                                }
                                // cut "Bulevardul" from street and add "boulevard" in the end, if language is english
                                if (street.startsWith("Bulevardul")) {
                                    street = `${street.substring(10, street.length)} boulevard`;
                                }
                            }
                            break;
                        }
                    }
                    // break loop if all address components found
                    if (streetNumber && street && locality) {
                        detectedPlaceText.innerHTML = `Detected location:<br>
                        ${streetNumber} ${street}, ${locality}`;
                        break;
                    } else {
                        detectedPlaceText.innerHTML = `Detected location: <br>
                        ${results[0].formatted_address.split(",")[0]}, ${results[0].formatted_address.split(",")[1]} <br>
                        Delivery not available for your area`;
                    }
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
var quickGrid = document.querySelector("#foodQuickSearchGrid");
var quickLink = quickGrid.querySelectorAll(".quickSearchLink");
for (var i = 0; i < quickLink.length; i++) {
    quickLink[i].addEventListener("click", function () {
        var current = document.querySelectorAll(".active");
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
        }
        this.className += " active";
        renderRestaurantsHtml(this.id);
    });
}

// set location manually, on input
var cityDelivery = document.querySelector("#cityDeliveryListInput");
cityDelivery.onchange = function () {
    console.log("cityDelivery", cityDelivery.value);
    locality = cityDelivery.value;
    localStorage.setItem("localityManual", locality);
    // clear restaurant results
    renderRestaurantsHtml("");
    // remove selected food quick link
    removeSelectedQuickLink();
};

// empty manual location input on click
cityDelivery.onclick = function () {
    cityDelivery.value = "";
    // clear manual location from local storage
    localStorage.setItem("localityManual", "");
};

// ======= fetch restaurants json =======
const jsonRestaurantsDataUrl = 'https://lucianpopa84.github.io/letsEat/data/restaurants.json';
fetch(jsonRestaurantsDataUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // localStorage.setItem("restaurantsData", JSON.stringify(data));
        restaurantsData = data;
    });

    // ======= fetch food json =======
const jsonFoodDataUrl = 'https://lucianpopa84.github.io/letsEat/data/food.json';
fetch(jsonFoodDataUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        foodData = data;
    });

// ======= render restaurants html =======
const restaurantList = document.querySelector(".restaurantList");
function renderRestaurantsHtml(data) {
    // remove previous restaurant cards
    if (restaurantList.hasChildNodes()) {
        while (restaurantList.firstChild) {
            restaurantList.removeChild(restaurantList.firstChild);
        }
    }
    // generate restaurant cards based on selected restaurant food type on quick search grid
    switch (data) {
        case "quickSearchPizza":
            console.log("Pizza restaurants selected");
            generateRestaurantCards("pizza");
            break;
        case "quickSearchDailyMenu":
            console.log("Daily menu restaurants selected");
            generateRestaurantCards("daily menu");
            break;
        case "quickSearchRomanian":
            console.log("Romanian food restaurants selected");
            generateRestaurantCards("romanian");
            break;
        case "quickSearchFastFood":
            console.log("Fast food restaurants selected");
            generateRestaurantCards("fast food");
            break;
        case "quickSearchSalads":
            console.log("Salads restaurants selected");
            generateRestaurantCards("salads");
            break;
        case "quickSearchDesert":
            console.log("Desert restaurants selected");
            generateRestaurantCards("desert");
            break;
    }
}

// generate restaurant cards based on selected restaurant food type on food list input
var foodTypeListInput = document.querySelector("#foodTypeListInput");
foodTypeListInput.onchange = function () {
    console.log("foodTypeListInput", foodTypeListInput.value);
    food = foodTypeListInput.value;
    removeSelectedQuickLink();
    generateRestaurantCards(food);
};

// empty food type input on click
foodTypeListInput.onclick = function () {
    foodTypeListInput.value = "";
};

// generate restaurant cards based on selected/detected city
function generateRestaurantCards(food) {
    if (restaurantsData) {
        let htmlContent = "";
        // retrieve city from local storage or manual city input
        let city = "";
        let cityManual = localStorage.getItem("localityManual");
        if (cityManual) {
            city = cityManual;
        } else {
            city = localStorage.getItem("locality");
        }
        console.log("city = ", city);
        for (let restaurantData of restaurantsData) {
            if (restaurantData.foodType.includes(food)) {
                if (restaurantData.location == city) {
                    htmlContent += `
                    <div class="restaurantCard" id="${restaurantData.id}" onclick="displayFood(this)"> 
                        <div class="row">
                            <div class="col-3">
                                <div class="card-image">
                                    <img src="${restaurantData.imageSrc}" alt="${restaurantData.imageAlt}">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="card-delivery">
                                    <h4>${restaurantData.name}</h4>`;
                    let currentDate = new Date();
                    let currentHour = currentDate.getHours();
                    if (currentHour < restaurantData.closeHour && currentHour >= restaurantData.operHour) {
                        htmlContent += `<p> <i class="fas fa-truck"></i> <span class="deliveryTime"> ${restaurantData.deliveryTime} min.</span> </p>`;
                    } else {
                        htmlContent += `<p> <i class="fas fa-truck"></i> <span class="deliveryTime"> closed </span> </p>`;
                    }
                    htmlContent += `</div>
                                <div class="card-rating">`;
                    for (let j = 0; j < restaurantData.rating; j++) {
                        htmlContent += `<span class="fa fa-star checked"></span>`;
                    };
                    for (let j = 0; j < 5 - restaurantData.rating; j++) {
                        htmlContent += `<span class="fa fa-star"></span>`;
                    };
                    htmlContent += `</div>
                            </div>
                            <div class="col-4">
                                <div class="card-pricing">
                                    <p> From: ${restaurantData.pricingFrom} RON </p>
                                    <p> To: ${restaurantData.pricingTo} RON </p>
                                    <p> Min: ${restaurantData.pricingMin} RON </p>
                                </div>
                            </div>
                        </div>
                    </div> `;
                }
            }
        }
        restaurantList.innerHTML = htmlContent;
    }
}

// ======= add links to logo and menus =======
document.querySelector(".letsEatLogo").addEventListener("click", function () {
    window.location = 'index.html';
});

const topDropdownMenu = document.querySelector(".dropdown-content");
document.querySelector("#topMenu").addEventListener("click", function () {
    if (topDropdownMenu.style.display === "block") {
        topDropdownMenu.style.display = "none";
    } else {
        topDropdownMenu.style.display = "block";
    }
});

// remove selected food quick link
function removeSelectedQuickLink() {
    for (let i = 0; i < quickLink.length; i++) {
        var current = document.querySelectorAll(".active");
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
        }
    }
}

//display restaurant's food on click
function displayFood(restaurant) {
    console.log("selected restaurant: ", restaurant.id);
    // remove other restaurant cards
    if (restaurantList.hasChildNodes()) {
        let restaurantCards = restaurantList.querySelectorAll(".restaurantCard");
        for (let restaurantCard of restaurantCards) {
            if (restaurantCard.id != restaurant.id) {
                restaurantList.removeChild(restaurantCard);
            }
        }
    }
    // remove quick grid and food search filter
    removeElementById("foodQuickSearchGrid");
    removeElementByClass("foodSearchFilter");
    // display food - work in progress
}

// remove element by id
function removeElementById(id) {
    let element = document.querySelector(`#${id}`);
    if (element) {
        element.parentNode.removeChild(element);
    }
    return false;
}

// remove element by class name
function removeElementByClass(className) {
    let element = document.querySelector(`.${className}`);
    if (element) {
        element.parentNode.removeChild(element);
    }
    return false;
}




