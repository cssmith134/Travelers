var searchFormEl = document.querySelector("#search-form");
var stateInputEl = document.querySelector("#city-input")
var stateSearchTermEl = document.querySelector("#state-search-term")
var caseNumberEl = document.querySelector(".case-number")
var deathNumberEl = document.querySelector(".death-number")
var riskLevelsEl = document.querySelector(".risk-levels")
var riskLevelNumberEl = document.querySelector(".risk-level-number")

var formSubmitHandler = function(event) {
    event.preventDefault();

    var stateName = stateInputEl.value.trim();

    if(stateName){
        getCovidData(stateName);
        stateInputEl.value = ""
    }else{
        alert("Enter a city name")
    }
}

var getCovidData = function(stateName) {
    const apiUrl = "https://api.covidactnow.org/v2/state/" + stateName + ".json?apiKey=61dfc57132df48e3b3c4c8497c299572";

    fetch(apiUrl)
    //converts the response to json
    .then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                structureHTML(data.actuals, data.state, data.riskLevels)
            })
        }else{
            alert("Please select a state")
        } 
    })
}

var structureHTML = function(data, state, risk) {
    stateSearchTermEl.textContent = state;

    var newCases = data.newCases;
        var newCasesNo = newCases.toLocaleString("en-US")
        caseNumberEl.innerHTML = newCasesNo

    var newDeaths = data.newDeaths;
        var newDeathsNo = newDeaths.toLocaleString("en-US")
        deathNumberEl.innerHTML = newDeathsNo

    console.log(risk);
    var levelsNumber = risk.overall;
        riskLevelNumberEl.innerHTML = levelsNumber

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


searchFormEl.addEventListener("submit", formSubmitHandler);