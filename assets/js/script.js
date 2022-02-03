//Acceptance Criteria
//GIVEN I am visiting a travel info website
//WHEN I click the search button
//THEN a city weather info shows up and I am presented with 5-days forecast

var searchFormEl = document.querySelector("#search-form");
var searchFormEl = document.querySelector("#search-container");
var stateInputEl = document.querySelector("#city-input")
var stateSearchTermEl = document.querySelector("#state-search-term")
var caseNumberEl = document.querySelector(".case-number")
var deathNumberEl = document.querySelector(".death-number")
var riskLevelsEl = document.querySelector(".risk-levels")
var riskLevelNumberEl = document.querySelector(".risk-level-number")
var cityInputEl = document.querySelector("#city-search");
var citySearchTerm = document.querySelector("#city-search-term")

var formSubmitHandler = function(event) {
    event.preventDefault();
    //console.log(event);

    //get value from input element
    var cityName = cityInputEl.value.trim();
    
    if(cityName) {
        getLatLon(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter city name")
    }
}

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

var displayHTML = function (data, cityName) {
    console.log(data, cityName)

    citySearchTerm.textContent = cityName;
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

//WHEN I click covid info on a navigation bar
var states = function() {
    var statesEl = document.querySelector("#states")
    var stateAbbr = statesEl.options[statesEl.selectedIndex].value
    var stateName = statesEl.options[statesEl.selectedIndex].text
    console.log(stateAbbr, stateName);
    getCovidData(stateAbbr, stateName);
} 

//THEN I am presented with covid info section
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

states();
searchFormEl.addEventListener("submit", formSubmitHandler);
