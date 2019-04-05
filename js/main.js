// ======= google geolocation =======
const detectedPlaceText = document.querySelector("#detectedPlace");

function initialize() {
    geocoder = new google.maps.Geocoder();
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        // navigator.geolocation.watchPosition(showPosition, showError);
        navigator.geolocation.getCurrentPosition(showPosition, showError);
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
                            streetNumber = address.long_name;
                            break;
                        }
                    }
                    // search for locality (city)
                    for (let address of result.address_components) {
                        if (address.types.includes("locality")) {
                            console.log("Locality results:", address.long_name);
                            locality = address.long_name;
                            localStorage.setItem("locality", locality);
                            break;
                        }
                    }
                    // search for route (street)
                    for (let address of result.address_components) {
                        if (address.types.includes("route")) {
                            console.log("Route results:", address.long_name);
                            street = address.long_name;
                            if (document.documentElement.lang.toLowerCase() === "en-us") {
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
            localStorage.setItem("foodType", "pizza");
            break;
        case "quickSearchDailyMenu":
            console.log("Daily menu restaurants selected");
            generateRestaurantCards("daily menu");
            localStorage.setItem("foodType", "daily menu");
            break;
        case "quickSearchRomanian":
            console.log("Romanian food restaurants selected");
            generateRestaurantCards("romanian");
            localStorage.setItem("foodType", "romanian");
            break;
        case "quickSearchFastFood":
            console.log("Fast food restaurants selected");
            generateRestaurantCards("fast food");
            localStorage.setItem("foodType", "fast food");
            break;
        case "quickSearchSalads":
            console.log("Salads restaurants selected");
            generateRestaurantCards("salads");
            localStorage.setItem("foodType", "salads");
            break;
        case "quickSearchDesert":
            console.log("Desert restaurants selected");
            generateRestaurantCards("desert");
            localStorage.setItem("foodType", "desert");
            break;
    }
}

// generate restaurant cards based on selected restaurant food type on food list input
var foodTypeListInput = document.querySelector("#foodTypeListInput");
foodTypeListInput.onchange = function () {
    console.log("foodTypeListInput", foodTypeListInput.value);
    food = foodTypeListInput.value;
    localStorage.setItem("foodType", food);
    removeSelectedQuickLink();
    generateRestaurantCards(food);
};

// empty food type input on click
foodTypeListInput.onclick = function () {
    foodTypeListInput.value = "";
    localStorage.setItem("foodType", "");
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
    // display food 
    let foodType = localStorage.getItem("foodType");
    console.log("Selected food type", foodType);
    // filter data from food json based on selected restaurant and food type
    const restaurantFood = foodData.filter(food => (food.restaurantId == restaurant.id && food.foodType == foodType));
    // console.log("restaurantFood: ", restaurantFood);
    let htmlContent = "";
    for (let foodItem of restaurantFood) {
        htmlContent += `
        <div class="foodCard">
        <div class="row">
            <div class="col-4">
                <div class="card-image">
                    <img src="${foodItem.imageSrc}" alt="${foodItem.imageAlt}">
                </div>
            </div>
            <div class="col-5">
                <div class="card-delivery">
                    <h4>${foodItem.name}</h4>
                    <p>${foodItem.ingredients}</p>
                </div>
                `;
        htmlContent += `<div class="card-rating">`;
        for (let j = 0; j < foodItem.rating; j++) {
            htmlContent += `<span class="fa fa-star checked"></span>`;
        };
        for (let j = 0; j < 5 - foodItem.rating; j++) {
            htmlContent += `<span class="fa fa-star"></span>`;
        };
        htmlContent += `
                </div>
            </div>
            <div class="col-3">
                <div class="card-pricing" id="${foodItem.name.split(" ").join("-")}">
                    <form id="${foodItem.restaurantId}PriceForm" class="priceForm">
                        <input type="number" name="quantity" min="1" max="10" value="1">
                        <button onclick="addItemToCart(this)" class="priceButton">${foodItem.price} RON</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
        `;
    }

    // render restaurant's food list html 
    const foodList = document.querySelector(".foodList");
    foodList.innerHTML = htmlContent;

    var priceFormButtons = document.querySelectorAll(".priceForm > button");
    console.log("priceFormButtons", priceFormButtons)
    // prevent default refresh action on click
    for (let priceFormButton of priceFormButtons) {
        priceFormButton.addEventListener("click", function (e) {
            e.preventDefault();
        });
    }

    // update add to cart price button on quantity change
    updateCartPrices();
}

// update add to cart price button on quantity change
function updateCartPrices(){
    var priceFormQuantityInputs = document.querySelectorAll(".priceForm > input[type=number]");
    console.log("priceFormQuantityInputs", priceFormQuantityInputs)
    for (let [index,priceFormQuantity] of priceFormQuantityInputs.entries()) {
        priceFormQuantity.addEventListener("change", function () {
            console.log("priceFormQuantity.value: ", priceFormQuantity.value);
            //    var priceButtonText = document.querySelectorAll(".price")[index];
            //    console.log("priceButtonText: ", priceButtonText);
            var priceButtonText = priceFormQuantity.nextElementSibling;
            console.log("priceButtonText: ", priceButtonText);
            // get price for 1 piece
            if (typeof (foodItemPrice) == 'undefined') {
                var foodItemPrice = parseFloat(priceButtonText.innerHTML.trim(" RON"));
            }
            console.log("foodItemPrice", foodItemPrice);
            priceButtonText.innerHTML = `${priceFormQuantity.value * foodItemPrice} RON`;
            console.log("priceButtonText.innerHTML: ", priceButtonText.innerHTML);
        });
    }
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

var cartItems = [];
// add item to cart
function addItemToCart(foodItem) {
    // check if item is already added in cart
    let cartItemsNames = [];
    if (localStorage.getItem('cartItems')){
        let cartItemsObject = localStorage.getItem('cartItems');
        let cartItems = JSON.parse(cartItemsObject);
        for (let i in cartItems){
            cartItemsNames.push(cartItems[i].foodName);
        }
    } 
    let foodName = foodItem.parentElement.parentElement.id.split("-").join(" ");
    if (cartItemsNames.includes(foodName)){
        alert("item already added!");
    } else {
        let itemPrice = parseFloat(foodItem.innerHTML.trim(" RON"));
        let restaurantId = foodItem.parentElement.id.split("PriceForm")[0];
        let foodType = localStorage.getItem("foodType");
        let quantity = foodItem.previousElementSibling.value;
        updateCartIconQuantity(quantity);
        let cartItemElements = { 'itemPrice': itemPrice, 'restaurantId': restaurantId, 'foodType': foodType, 'foodName': foodName, 'quantity': quantity};
        cartItems.push(cartItemElements);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
}

// update cart icon quantity number
const cartIconQuantity = document.querySelector(".cartItems");

function updateCartIconQuantity(quantity) {
    if(localStorage.getItem("cartItemsNumber")!= 'undefined'){
        var cartItemsNumber = parseFloat(localStorage.getItem("cartItemsNumber"));
    } else {
        var cartItemsNumber = 0;
    }
    cartItemsNumber += parseFloat(quantity);
    if (cartItemsNumber > 0){
        cartIconQuantity.innerHTML = cartItemsNumber;
    } else {
        cartIconQuantity.innerHTML = ""; 
    }
    localStorage.setItem("cartItemsNumber", cartItemsNumber);
}

const cart = document.querySelector("#cart");
const cartButton = document.querySelector("#cartButton");
cartButton.addEventListener("click", renderCartHtml);

// render cart html
function renderCartHtml() {
    // remove elements
    removeElementByClass("addressForm");
    removeElementById("foodQuickSearchGrid");
    removeElementByClass("foodSearchFilter");
    removeElementByClass("restaurantList");
    removeElementByClass("foodList");

    let htmlContent = "";
    htmlContent += `
    <div class="checkout">
    <h2>Cart</h2>
    </div>

    <div class="foodList">
    <div class="flex-container">
    `;

    let cartItemsObject = localStorage.getItem('cartItems');
    let cartItems = JSON.parse(cartItemsObject);
    totalPrice = 0;
    let quantity = 0;
    // loop through cart items
    for (let i in cartItems){
        console.log(cartItems[i]);
        htmlContent += `
            <div class="foodCard">
            <div class="row">
                <div class="col-3">
                    <div class="card-image">
                        <img src="images/foodType/pizza.png " alt="${cartItems[i].foodName}">
                    </div>
                </div>
                <div class="col-3">
                    <div class="card-delivery">
                        <h4 class="foodName">${cartItems[i].foodName}</h4>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card-pricing">
                        <form class="priceForm">
                            <input type="number" name="quantity" min="1" max="10" value="${cartItems[i].quantity}" onchange="updateCart()">
                            <input type="button" value="&#x1F5D1" onclick="removeItem()">
                        </form>
                    </div>
                </div>
                <div class="col-2">
                    <p class="price">${cartItems[i].itemPrice} RON</p>
                </div>
            </div>
        </div>
        `;
        totalPrice += cartItems[i].itemPrice;
        quantity += parseFloat(cartItems[i].quantity);
    }

    htmlContent += `
        </div>
    </div>

    <div class="total">
    <h2 id="totalPrice">Total = ${totalPrice} RON</h2>
    </div>

    <div class="checkoutForm">
    <form id="checkoutForm" onsubmit="submitOrder()">
        <div class="checkoutAddress flex-container">
            <i class="fas fa-map-marker-alt"> </i>
            <p id="detectedDeliveryPlace"> </p>
            <input name="address" id="manualAddress" onkeyup="setManualDeliveryAddress(this)" autocomplete="address-level2" placeholder="Change address">
        </div>

        <label for="clientName">Name </label>
        <input type="text" id="clientName" name="name" placeholder="Enter your name" autocomplete="name" required>

        <label for="clientPhone">Phone </label>
        <input type="tel" id="clientPhone" name="phone" placeholder="Enter phone number" autocomplete="tel" required>

        <label for="deliveryTime">Preferred delivery time:</label>
        <input type=time id="deliveryTime" min="11:00" max="21:00" step="900" value="12:30" name="delivery">

        <label for="comments">Comments</label>
        <textarea id="comments" name="comments" style="height:100px" maxlength=1000 placeholder="Delivery instructions:"></textarea>

        <input type="submit" value="Submit order">
    </form>
    </div>
    `;
    localStorage.setItem("cartItemsNumber", 0);
    updateCartIconQuantity(quantity);
    cart.innerHTML = htmlContent;
    detectedDeliveryPlaceText = document.querySelector("#detectedDeliveryPlace");
    detectedDeliveryPlaceText.innerHTML = `Deliver to:<br>
    ${streetNumber} ${street}, ${locality}`;
    checkoutForm=document.querySelector("#checkoutForm")
    updateCartPrices();
};


// remove item from cart
function removeItem(){
    let foodNames = document.querySelectorAll(".foodName");
    console.log(foodNames[0].innerHTML);
        // remove item from localstorage
        let cartItemsNames = [];
        if (localStorage.getItem('cartItems')){
            let cartItemsObject = localStorage.getItem('cartItems');
            var cartItemsLocal = JSON.parse(cartItemsObject);
            for (let i in cartItemsLocal){
                cartItemsNames.push(cartItemsLocal[i].foodName);
            }
        } 
        let foodName = foodNames[0].innerHTML;
        // update local storage cart items
        if (cartItemsNames.includes(foodName)){
            cartItemsLocal = cartItemsLocal.filter(item => (item.foodName != foodName));
            localStorage.setItem("cartItems", JSON.stringify(cartItemsLocal));
        }
    renderCartHtml();
}

// set manual delivery address
function setManualDeliveryAddress(element) {
    detectedDeliveryPlaceText.innerHTML = `Deliver to:<br>
    ${element.value}`;
}

// submit order
function submitOrder(){
    let clientName = document.querySelector("#clientName");
    alert(`Order for ${clientName.value} is placed`);
}

// update total and cart icon quantity
// =======  work in progress =======
function updateCart(){
    // updateCartIconQuantity(quantity);
    let foodNames = document.querySelectorAll(".foodName");
    let foodName = foodNames[0].innerHTML;
    console.log("modified quantity food:",foodName);
}






    

