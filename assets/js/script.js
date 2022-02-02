//Acceptance Criteria
//GIVEN I am visiting a travel info website
//WHEN I click the search button
//THEN a city weather info shows up and I am presented with 5-days forecast

var searchFormEl = document.querySelector("#search-container");
var stateInputEl = document.querySelector("#city-input")
var stateSearchTermEl = document.querySelector("#state-search-term")
var caseNumberEl = document.querySelector(".case-number")
var deathNumberEl = document.querySelector(".death-number")
var riskLevelsEl = document.querySelector(".risk-levels")
var riskLevelNumberEl = document.querySelector(".risk-level-number")

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
            caseNumberEl.innerHTML = "Sorry, this data is unavailable at this time"
        }else {
            caseNumberEl.innerHTML = newCasesNo.toLocaleString("en-US")
        }

    var newDeaths = data.newDeaths;
        var newDeathsNo = newDeaths
        if(newDeaths == null){
            deathNumberEl.innerHTML = "Sorry, this data is unavailable at this time"
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
// searchFormEl.addEventListener("submit", states);