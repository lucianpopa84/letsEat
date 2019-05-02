const detectedPlaceText = document.querySelector("#detectedPlace");
const restaurantList = document.querySelector(".restaurantList");
const quickGrid = document.querySelector("#foodQuickSearchGrid");
const quickLink = quickGrid.querySelectorAll(".quickSearchLink");
const cityDelivery = document.querySelector("#cityDeliveryListInput");
const foodTypeListInput = document.querySelector("#foodTypeListInput");
const topDropdownMenu = document.querySelector(".dropdown-content");
const cartIconQuantity = document.querySelector(".cartItems");
const cart = document.querySelector("#cart");
const cartButton = document.querySelector("#cartButton");
const foodList = document.querySelector(".foodList");

function initialize() {
    geocoder = new google.maps.Geocoder();
    getLocation();
    updateCartIconQuantity();
}

// ======= google geolocation ======= 
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
                        getCityId(locality);
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

// ======= get city id from json server =======
function getCityId(locality) {
    let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/cities?q=${locality}`;
    fetch(url)
        .then(response => response.json())
        .then(cityData => {
            if (cityData.length == 1) {
                console.log("cityData[0].id: ", cityData[0].id);
                cityId = cityData[0].id;
            } else {
                detectedPlaceText.innerHTML = "Delivery not available for your area";
            }
        }).catch(error => console.log("error: ", error.message));
}

// ======= get food type id from json server =======
function getFoodTypeId(food) {
    let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/foodType?q=${food}`;
    fetch(url)
        .then(response => response.json())
        .then(foodTypeData => {
            if (foodTypeData.length == 1) {
                foodTypeId = foodTypeData[0].id;
            }
        }).catch(error => console.log("error: ", error.message));
}

// ======= quick search grid =======
for (let i of quickLink.keys()) {
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
cityDelivery.onchange = () => {
    locality = cityDelivery.value;
    getCityId(locality);
    detectedPlaceText.innerHTML = `Selected city: ${locality}`;
    // remove previous restaurant cards
    removeRestaurantCards()
    // remove selected food quick link
    removeSelectedQuickLink();
};

// empty manual location input on click
cityDelivery.onclick = () => {
    cityDelivery.value = "";
};

// execute on google geolocation icon click
function detectLocation() {
    // geolocation
    initialize();
}

// ======= render restaurants html =======
function renderRestaurantsHtml(data) {
    removeRestaurantCards();
    // generate restaurant cards based on selected restaurant food type on quick search grid
    switch (data) {
        case "quickSearchPizza":
            console.log("Pizza restaurants selected");
            foodTypeId = 1;
            break;
        case "quickSearchDesert":
            console.log("Desert restaurants selected");
            foodTypeId = 3;
            break;
        case "quickSearchFastFood":
            console.log("Fast food restaurants selected");
            foodTypeId = 4;
            break;
        case "quickSearchSalads":
            console.log("Salads restaurants selected");
            foodTypeId = 7;
            break;
        case "quickSearchDailyMenu":
            console.log("Daily menu restaurants selected");
            foodTypeId = 8;
            break;
        case "quickSearchRomanian":
            console.log("Romanian food restaurants selected");
            foodTypeId = 9;
            break;
        default: ;
    }
    generateRestaurantCards(foodTypeId);
}

// remove previous restaurant cards
function removeRestaurantCards() {
    if (restaurantList.hasChildNodes()) {
        while (restaurantList.firstChild) {
            restaurantList.removeChild(restaurantList.firstChild);
        }
    }
}

// generate restaurant cards on food list input change event
foodTypeListInput.onchange = () => {
    console.log("foodTypeListInput", foodTypeListInput.value);
    food = foodTypeListInput.value;
    getFoodTypeId(food);
    generateRestaurantCards(foodTypeId);
    removeSelectedQuickLink();
};

// empty food type input on click
foodTypeListInput.onclick = () => {
    foodTypeListInput.value = "";
};

// generate restaurant cards based on selected/detected city
function generateRestaurantCards(foodTypeId) {
    // ==== json server call ========
    console.log("foodTypeId: ", foodTypeId);
    let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/restaurants?cityId=${cityId}&foodTypeId=${foodTypeId}`;
    fetch(url)
        .then(response => response.json())
        .then(restaurantsData => {
            restaurantList.innerHTML = "Searching for restaurants...";
            if (restaurantsData.length >= 1) {
                let htmlContent = "";
                for (let restaurantData of restaurantsData) {
                    htmlContent += `
                    <div class="restaurantCard" id="restId${restaurantData.id}" onclick="displayFood(this,${restaurantData.id})"> 
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
                restaurantList.innerHTML = htmlContent;
            } else {
                restaurantList.innerHTML = "No restaurants found!";
            }
        }).catch(error => console.log("error: ", error.message));
}

// ======= add links to logo and menus =======
document.querySelector(".letsEatLogo").addEventListener("click", () => {
    window.location = 'index.html';
});

document.querySelector("#topMenu").addEventListener("click", () => {
    if (topDropdownMenu.style.display === "block") {
        topDropdownMenu.style.display = "none";
    } else {
        topDropdownMenu.style.display = "block";
    }
});

// remove selected food quick link
function removeSelectedQuickLink() {
    let current = document.querySelectorAll(".active");
    if (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
    }
}

//display restaurant's food on click
function displayFood(restaurant, id) {
    let url = `https://my-json-server.typicode.com/lucianpopa84/myjsonserver/food/?restaurantId=${id}&foodTypeId=${foodTypeId}`;
    fetch(url)
        .then(response => response.json())
        .then(foodData => {
            // check if restaurant is closed
            let restaurantCardId = restaurantList.querySelector(`#${restaurant.id}`);
            let restaurantTime = restaurantCardId.querySelector(".deliveryTime").innerHTML;
            if (restaurantTime == " closedTEST ") {
                alert("Restaurant is closed!");
            } else {
                if (foodData.length >= 1) {
                    foodList.innerHTML = "Serching for restaurant food...";
                }
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
                let htmlContent = "";
                for (let foodItem of foodData) {
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
                            <div class="card-pricing">
                                <form class="priceForm ${foodItem.restaurantId}">
                                    <input type="number" name="quantity" min="1" max="10" value="1" class="quantityInput">
                                    <button class="priceButton" data-price="${foodItem.price}" data-name="${foodItem.name}"> ${foodItem.price} RON </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                    `;
                }
                // render restaurant's food list html 
                foodList.innerHTML = htmlContent;
                // get image element
                cardImage = document.querySelectorAll(".card-image");
                // get price button elements and prevent default refresh action on click 
                const priceFormButtons = document.querySelectorAll(".priceForm > button");
                for (let priceFormButton of priceFormButtons) {
                    priceFormButton.addEventListener("click", (event) => {
                        event.preventDefault();
                    });
                }
                for (let [index, priceFormButton] of priceFormButtons.entries()) {
                    priceFormButton.addEventListener("click", addItemToCart);
                    priceFormButton.index = index;
                }
                // add event listners to quantity inputs 
                const priceFormQuantityInputs = document.querySelectorAll(".priceForm > input[type=number]");
                for (let [index, priceFormQuantity] of priceFormQuantityInputs.entries()) {
                    priceFormQuantity.addEventListener("change", updateFoodPrices);
                    priceFormQuantity.index = index;
                }
                // prevent default refresh on input submit
                const priceForm = document.querySelectorAll(".priceForm");
                for (let priceFormItem of priceForm)
                    priceFormItem.addEventListener("submit", (event) => {
                        event.preventDefault();
                    });
            }
        });
}

// update add to cart price button on quantity change 
function updateFoodPrices(event) {
    let index = event.target.index;
    let newQuantity = event.target.value;
    let priceButton = document.querySelectorAll(".priceButton")[index];
    // get price for 1 piece
    let foodItemPrice = priceButton.dataset.price;
    priceButton.innerHTML = `${newQuantity * foodItemPrice} RON`;
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
// add item to cart -OK
function addItemToCart(event) {
    let index = event.target.index;
    let priceButton = event.target;
    let foodName = priceButton.dataset.name;
    let quantity = priceButton.previousElementSibling.value;
    let itemPrice = parseFloat(priceButton.dataset.price);
    let restaurantId = priceButton.parentElement.className.split(" ")[1];
    let imageSrc = cardImage[index + 1].children[0].src;
    let imageAlt = cardImage[index + 1].children[0].alt;
    // check if localstorage contains items
    if (localStorage.getItem('cartItems')) {
        let cartItemsObject = localStorage.getItem('cartItems');
        let cartItems = JSON.parse(cartItemsObject);
        // check if item is from different restaurant
        let differentRestaurant = cartItems.find(cartItem => cartItem.restaurantId != restaurantId);
        if (differentRestaurant) {
            alert("Item is from different restaurant! \nPlease add food from the same restaurant!");
        } else {
            // check if item is already added in cart
            let existingCartItem = cartItems.find(cartItem => cartItem.foodName == foodName);
            if (existingCartItem) {
                alert("Food already added in cart!");
            } else {
                let cartItemElements = { 'itemPrice': itemPrice, 'restaurantId': restaurantId, 'foodName': foodName, 'quantity': quantity, 'imageSrc': imageSrc, 'imageAlt': imageAlt };
                cartItems.push(cartItemElements);
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
            }
        }
    } else {
        let cartItemElements = { 'itemPrice': itemPrice, 'restaurantId': restaurantId, 'foodName': foodName, 'quantity': quantity, 'imageSrc': imageSrc, 'imageAlt': imageAlt };
        cartItems.push(cartItemElements);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
    // update cart icon quantity
    let newCartItemsObject = localStorage.getItem('cartItems');
    let newCartItems = JSON.parse(newCartItemsObject);
    let cartItemsNumber = newCartItems.reduce((total, cartItem) => {
        return total + (parseFloat(cartItem.quantity));
    }, 0);
    // update cart icon quantity number
    localStorage.setItem("cartItemsNumber", cartItemsNumber);
    updateCartIconQuantity();
}

// update cart icon quantity number 
function updateCartIconQuantity() {
    if (localStorage.getItem("cartItemsNumber") != "undefined") {
        var cartItemsNumber = parseFloat(localStorage.getItem("cartItemsNumber"));
    } else {
        var cartItemsNumber = 0;
    }
    if (cartItemsNumber > 0) {
        cartIconQuantity.innerHTML = cartItemsNumber;
    } else {
        cartIconQuantity.innerHTML = "";
    }
}

cartButton.addEventListener("click", renderCartHtml);

// render cart html
function renderCartHtml() {
    // remove html elements from view
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

    // get food items from localstorage
    let cartItemsObject = localStorage.getItem('cartItems');
    let cartItems = JSON.parse(cartItemsObject);

    // loop through cart items
    for (let i in cartItems) {
        htmlContent += `
            <div class="foodCard" data-name="${cartItems[i].foodName}" data-price="${cartItems[i].itemPrice}">
            <div class="row">
                <div class="col-3">
                    <div class="card-image">
                        <img src="${cartItems[i].imageSrc}" alt="${cartItems[i].imageAlt}">
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
                            <input type="number" name="quantity" min="1" max="10" value="${cartItems[i].quantity}" class="cartQuantityInput">
                            <input type="button" value="&#10007">
                        </form>
                    </div>
                </div>
                <div class="col-2">
                    <p class="price">${cartItems[i].itemPrice * cartItems[i].quantity} RON</p>
                </div>
            </div>
        </div>
        `;
    }

    // compute total price 
    let totalPrice = cartItems.reduce((total, cartItem) => {
        return total + (cartItem.quantity * parseFloat(cartItem.itemPrice));
    }, 0);

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

    cart.innerHTML = htmlContent;
    const detectedDeliveryPlaceText = document.querySelector("#detectedDeliveryPlace");
    detectedDeliveryPlaceText.innerHTML = `Deliver to:<br>
    ${streetNumber} ${street}, ${locality}`;

    // add event listener to delete buttons 
    const cartDeleteButtons = document.querySelectorAll(".priceForm > input[type=button]");
    for (let [index, cartDeleteButton] of cartDeleteButtons.entries()) {
        cartDeleteButton.addEventListener("click", removeItem);
        cartDeleteButton.index = index;
    }

    // add event listners to quantity inputs 
    const priceFormQuantityInputs = document.querySelectorAll(".priceForm > input[type=number]");
    for (let [index, priceFormQuantity] of priceFormQuantityInputs.entries()) {
        priceFormQuantity.addEventListener("change", updateCart);
        priceFormQuantity.index = index;
    }

    // prevent default refresh on input submit
    const priceForm = document.querySelectorAll(".priceForm");
    for (let priceFormItem of priceForm)
        priceFormItem.addEventListener("submit", (event) => {
            event.preventDefault();
        })

    // get all food cards
    foodItems = document.querySelectorAll(".foodCard");
    // get all price display paragraphs
    itemPrice = document.querySelectorAll(".price");
    // get total amount display
    totalPrice = document.querySelector("#totalPrice");
};

// remove item from cart
function removeItem(event) {
    let index = event.target.index;
    let foodItemName = foodItems[index].dataset.name;
    // remove item from localstorage
    let cartItemsObject = localStorage.getItem('cartItems');
    let cartItems = JSON.parse(cartItemsObject);
    // find item index in cart items object
    let cartItemIndex = cartItems.findIndex(cartItem => cartItem.foodName == foodItemName);
    // remove item from local storage object array
    cartItems.splice(cartItemIndex, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    // update cart icon quantity
    let cartItemsNumber = cartItems.reduce((total, cartItem) => {
        return total + (parseFloat(cartItem.quantity));
    }, 0);
    // update cart icon quantity number in localstorage
    localStorage.setItem("cartItemsNumber", cartItemsNumber);
    updateCartIconQuantity();
    // update total amount display
    let newTotalPrice = cartItems.reduce((total, cartItem) => {
        return total + (cartItem.quantity * parseFloat(cartItem.itemPrice));
    }, 0);
    totalPrice.innerHTML = `${newTotalPrice} RON`;
    // remove items from view
    foodItems[index].remove();
}

// set manual delivery address
function setManualDeliveryAddress(element) {
    const detectedDeliveryPlaceText = document.querySelector("#detectedDeliveryPlace");
    detectedDeliveryPlaceText.innerHTML = `Deliver to:<br>
    ${element.value}`;
}

// submit order
function submitOrder() {
    let clientName = document.querySelector("#clientName");
    alert(`Order for ${clientName.value} is placed`);
}

// update cart on quantity change
function updateCart(event) {
    let index = event.target.index;
    let newQuantity = event.target.value;
    let foodItemPrice = foodItems[index].dataset.price;
    let foodItemName = foodItems[index].dataset.name;
    // get food items from localstorage
    let cartItemsObject = localStorage.getItem('cartItems');
    let cartItems = JSON.parse(cartItemsObject);
    // set new quantity in localstorage food object
    cartItems.forEach(cartItem => {
        if (cartItem.foodName == foodItemName) {
            cartItem.quantity = newQuantity;
        }
    });
    // update food items in localstorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    // update cart icon quantity
    let cartItemsNumber = cartItems.reduce((total, cartItem) => {
        return total + (parseFloat(cartItem.quantity));
    }, 0);
    // update cart icon quantity number in localstorage
    localStorage.setItem("cartItemsNumber", cartItemsNumber);
    updateCartIconQuantity();
    // update total amount display
    let newTotalPrice = cartItems.reduce((total, cartItem) => {
        return total + (cartItem.quantity * parseFloat(cartItem.itemPrice));
    }, 0);
    totalPrice.innerHTML = `${newTotalPrice} RON`;
    // update food item price display 
    itemPrice[index].innerHTML = `${newQuantity * foodItemPrice} RON`;
}


