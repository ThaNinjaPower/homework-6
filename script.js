var key = "808d3ba8df6ac4e4cd1c7957a8c1af5a";
var cityCounter = 0;
var cityList = [];

// Import current date
var currentDate = new Date();
$("#current-month").text((currentDate.getMonth() + 1) + "/");
$("#current-day").text(currentDate.getDate() + "/");
$("#current-year").text(currentDate.getFullYear());
console.log(currentDate);

// Import five days in the future
for (var i = 1; i <= 5; i++) {
    currentDate.setDate(currentDate.getDate() + i);
    $("#month" + i).text(currentDate.getMonth() + 1 + "/");
    $("#day" + i).text(currentDate.getDate() + "/");
    $("#year" + i).text(currentDate.getFullYear());
    currentDate.setDate(currentDate.getDate() - i);
}

// Clicking on search
$("#city-search-button").on("click", function (event) {
    currentCityWeather(event, $("#city-search").val().trim());
});

// Appends city weather and forecasts to screen
function currentCityWeather(e, cityInput) {
    e.preventDefault();
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + key,
        async: false,
        method: "GET"
    }).then(function (currentResponse) {
        console.log(currentResponse);
        localStorage.clear();
        localStorage.setItem("Current City", JSON.stringify(currentResponse));
        cityList.push(currentResponse);
        localStorage.setItem("Searched Cities", JSON.stringify(cityList));

        // City name
        console.log(currentResponse.name);
        $("#city-name").text(currentResponse.name);

        // City current temperature
        console.log(Math.round(currentResponse.main.temp) + " °F");
        $("#city-temp-current").text(Math.round(currentResponse.main.temp) + " °F");

        // City current humidity
        console.log(currentResponse.main.humidity + "%");
        $("#city-humidity-current").text(currentResponse.main.humidity + "%");

        // City current wind speed
        console.log(Math.round(currentResponse.wind.speed) + "mph");
        $("#city-wind-current").text(Math.round(currentResponse.wind.speed) + " mph");
        
        // City wind direction
        // Credit: https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words
        $("#city-direction-current").text(degreesToCompass(currentResponse.wind.deg));

        // Current weather icon
        var iconCode = currentResponse.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
        console.log(iconURL);
        $("#current-icon").attr("src", iconURL);

        // City coordinates
        var currentLatitude = currentResponse.coord.lat;
        var currentLongitude = currentResponse.coord.lon;
        console.log(currentLatitude + ", " + currentLongitude);

        // Dark or light mode depending on time of day
        var sunriseTimeStamp = new Date(currentResponse.sys.sunrise * 1000);
        var sunsetTimeStamp = new Date(currentResponse.sys.sunset * 1000);

        console.log("Sunrise: " + sunriseTimeStamp);
        console.log("Sunset: " + sunsetTimeStamp);
        console.log(currentDate);

        // Check if time is past sunrise but not past sunset
        if (currentDate >= sunriseTimeStamp && currentDate < sunsetTimeStamp) {
            console.log("Day time");
            $("#search-sidebar").addClass("bg-light").removeClass("bg-dark");
            $("#main").addClass("bg-light").removeClass("bg-dark");
            $("body").css({ "background-color": "white", "color": "black" });
        }

        // Check if time is past sunset
        else if (currentDate >= sunsetTimeStamp) {
            console.log("Night time");
            $("#search-sidebar").addClass("bg-dark").removeClass("bg-light");
            $("#main").addClass("bg-dark").removeClass("bg-light");
            $("body").css({ "background-color": "#222222", "color": "white" });
        }

        var searchedCity = $("<li>");
        searchedCity.addClass("list-group-item");
        searchedCity.text(currentResponse.name);
        $("#searched-city-list").append(searchedCity);

        forecastedCityWeather(e, currentLatitude, currentLongitude);
    }).catch(function (error) {
        $("#error-message").text("City not found.");
    });
}

// Credit: https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words
function degreesToCompass(degree) {
    var val = Math.floor((degree / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

function forecastedCityWeather(e, latitude, longitude) {
    e.preventDefault();
    // 5 day forecasts
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + key,
        async: false,
        method: "GET"
    }).then(function (forecastedResponse) {
        console.log(forecastedResponse);

        // City current uv index
        console.log(forecastedResponse.current.uvi);
        $("#city-uv-current").text(forecastedResponse.current.uvi);

        for (var i = 1; i <= 5; i++) {
            console.log("Day " + i + " temp: " + Math.round(forecastedResponse.daily[i].temp.day) + " °F");
            $("#day" + i + "-temp").text(Math.round(forecastedResponse.daily[i].temp.day) + " °F");

            console.log("Day " + i + " humidity: " + forecastedResponse.daily[i].humidity + "%");
            $("#day" + i + "-humidity").text(forecastedResponse.daily[i].humidity + "%");

            var iconCode = forecastedResponse.daily[i].weather[0].icon;
            var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
            console.log(iconURL);
            $("#day" + i + "-icon").attr("src", iconURL);
        }
    }).catch(function (error) {
        $("#error-message").text("City not found.");
    })
}