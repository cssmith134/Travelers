//Acceptance Criteria
//GIVEN I am visiting a travel info website
//WHEN I click the search button
//THEN a city weather info shows up and I am presented with 5-days forecast

var searchFormEl = document.querySelector("#search-form");
var searchFormEl = document.querySelector("#search-container");
var stateInputEl = document.querySelector("#city-input");
var stateSearchTermEl = document.querySelector("#state-search-term");
var caseNumberEl = document.querySelector(".case-number");
var deathNumberEl = document.querySelector(".death-number");
var riskLevelsEl = document.querySelector(".risk-levels");
var riskLevelNumberEl = document.querySelector(".risk-level-number");
var cityInputEl = document.querySelector("#city-search");
var citySearchTerm = document.querySelector("#city-search-term");
var cities = JSON.parse(localStorage.getItem("cities")) || [];
var leftBox = document.querySelector("#leftBox");

var formSubmitHandler = function(event) {
    event.preventDefault();
    //console.log(event);

    //get value from input element
    var cityName = cityInputEl.value.trim();
    
    if(cityName) {
        // cities.push(cityName)
        saveEvent();
        saveSearch(cityName);
        getLatLon(cityName);
        cityInputEl.value = "";
    // } else {
    //     alert("Please enter city name")
    }
}

//creates a button for search history
var saveSearch = function (name) {
    var newBtn = document.createElement("btn");
    newBtn.classList = "btn-light-primary saveBtn border rounded p-2 m-3";
    var cityBtn = name.toLowerCase();
    cityBtn = cityBtn.split(" ");
    for (let i = 0; i < cityBtn.length; i++) {
        cityBtn[i] = cityBtn[i][0].toUpperCase() + cityBtn[i].substring(1);
    }
    newBtn.textContent = cityBtn.join(" ")
    newBtn.style.margin = "10px";
    newBtn.addEventListener("click", function(event) {
      getLatLon(event.target.textContent)
    })
    leftBox.appendChild(newBtn)
  }

//gets coordinates for the city entered by user
var getLatLon = function(cityName) {
    //format the weather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=9e1b9c65c5a45c7606cbddd777f0e91b";
    
    //make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            getWeather(data.coord.lat, data.coord.lon, cityName);;
        });
    }else{
        alert("Please enter valid city name");
    }
})
}

//gets weather data for the city entered
var getWeather = function(lat, lon, cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=37b206da464f2ac783efca5a706e09d3";
    
    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayHTML(data, cityName);
                console.log(data);
            });
        }
    })
}

//displays weather on the screen
var displayHTML = function (data, cityName) {
    console.log(data, cityName)

    //creates  first letter of user input to uppercase
    var cityTitle = cityName.toLowerCase();
    cityTitle = cityTitle.split(" ");
    for(let i = 0; i <cityTitle.length; i++){
        cityTitle[i] = cityTitle[i][0].toUpperCase() + cityTitle[i].substring(1);
    }
    citySearchTerm.textContent = cityTitle.join(" ");
    var forecastEls = document.querySelectorAll(".forecast");
    for (let i=0; i<forecastEls.length; i++) {
        forecastEls[i].innerHTML = "";
        const forecastIndex = i;
        var options = {year: "numeric", month: "numeric", day: "numeric"};
        var forecastUnixTimestamp = data.daily[forecastIndex].dt;
        var forecastMilliseconds = forecastUnixTimestamp * 1000;
        var futureDate = new Date(forecastMilliseconds)
        var forecastDate = futureDate.toLocaleDateString("en-US", options)
        var forecastDateEl = document.createElement("p");
        forecastDateEl.setAttribute("class", "forecast-date")
        forecastDateEl.innerHTML = forecastDate;
        forecastEls[i].append(forecastDateEl)

        var forecastWeatherEl = document.createElement("img")
        forecastIconCode = data.daily[forecastIndex].weather[0].icon;
        forecastWeatherEl.setAttribute("src", "http://openweathermap.org/img/w/" + forecastIconCode + ".png")
        forecastEls[i].append(forecastWeatherEl)

        var forecastTempEl = document.createElement("p")
        var temp = data.daily[forecastIndex].temp.max 
        forecastTempEl.innerHTML = Math.floor(temp) + " &#176F";
        forecastEls[i].append(forecastTempEl);
    }
}

//WHEN I select a state from the dropdown menu in the Covid section
var states = function() {
    var statesEl = document.querySelector("#states")
    var stateAbbr = statesEl.options[statesEl.selectedIndex].value
    var stateName = statesEl.options[statesEl.selectedIndex].text
    console.log(stateAbbr, stateName);
    getCovidData(stateAbbr, stateName);
} 

//gets Covid data for the state selected
var getCovidData = function(stateAbbr, stateName) {
    const apiUrl = "https://api.covidactnow.org/v2/state/" + stateAbbr + ".json?apiKey=61dfc57132df48e3b3c4c8497c299572";

    fetch(apiUrl)
    //converts the response to json
    .then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                structureHTML(data.actuals, data.riskLevels)
            })
        // }else{
        //     alert("Please select a state")
        } 
    })
}

//THEN I am presented with covid info section
var structureHTML = function(data, risk)  {
    var newCases = data.newCases;
        var newCasesNo = newCases
        if (newCases == null){
            caseNumberEl.innerHTML = " "
        }else {
            caseNumberEl.innerHTML = newCasesNo.toLocaleString("en-US")
        }

    var newDeaths = data.newDeaths;
        var newDeathsNo = newDeaths
        if(newDeaths == null){
            deathNumberEl.innerHTML = " "
        } else {
            deathNumberEl.innerHTML = newDeathsNo.toLocaleString("en-US")
        }

    console.log(risk);
    var levelsNumber = risk.overall;
        riskLevelNumberEl.textContent = levelsNumber + " *"

        if(levelsNumber < 2) {
            riskLevelNumberEl.style.backgroundColor = "green";
            riskLevelNumberEl.style.display = "inline";
        }else if (levelsNumber === 3) {
            riskLevelNumberEl.style.backgroundColor = "yellow";
            riskLevelNumberEl.style.display = "inline";
        }else {
            riskLevelNumberEl.style.backgroundColor = "red";
            riskLevelNumberEl.style.display = "inline";
        }
}

//saves to localStorage
var saveEvent = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

states();
searchFormEl.addEventListener("submit", formSubmitHandler);
