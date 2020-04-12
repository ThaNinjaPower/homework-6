var key = "808d3ba8df6ac4e4cd1c7957a8c1af5a";

// Import current date
var currentDate = new Date();
$("#current-month").text("(" + (currentDate.getMonth() + 1) + "/");
$("#current-day").text(currentDate.getDate() + "/");
$("#current-year").text(currentDate.getFullYear() + ")");

// Import five days in the future
for (var i = 1; i <= 5; i++) {
    currentDate.setDate(currentDate.getDate() + i);
    $("#month" + i).text(currentDate.getMonth() + 1 + "/");
    $("#day" + i).text(currentDate.getDate() + "/");
    $("#year" + i).text(currentDate.getFullYear());
    console.log(currentDate);
    currentDate.setDate(currentDate.getDate() - i);
}

// Clicking on search
$("#city-search-button").on("click", function(event) {
    currentCityWeather(event, $("#city-search").val().trim());
});

// Clicking on a city


function currentCityWeather(e, cityInput) {
    e.preventDefault();

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput  + "&units=imperial&appid=" + key,
        async: false,
        method: "GET"
    }).then(function(currentResponse) {
        console.log(currentResponse);
        localStorage.clear();
        localStorage.setItem("Current City", JSON.stringify(currentResponse));

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

        // Current weather icon
        var iconCode = currentResponse.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
        console.log(iconURL);
        $("#current-icon").attr("src", iconURL);

        // City coordinates
        var latitude = currentResponse.coord.lat;
        var longitude = currentResponse.coord.lon;
        console.log(latitude + ", " + longitude);

        // 5 day forecasts
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + key,
            async: false,
            method: "GET"
        }).then(function(forecastedResponse) {
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
        });
    });
}