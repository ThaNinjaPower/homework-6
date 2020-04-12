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
$("#city-search-button").on("click", changeCity(event, $("#city-search").val().trim()));

// Clicking on a city


function changeCity(e, cityInput) {
    e.preventDefault();
    
    $.ajax({
        url: "",
        method: "GET"
    }).then(function(response) {

    });
}