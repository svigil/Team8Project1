var map;
var sourceLat, sourceLong, destinationLat, destinationLong;

$("#get-map").on("click", function (event) {
    event.preventDefault(event);
    var sourceAddress = $(".source").val();
    var destinationAddress = $(".destination").val();
    var sourceQueryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + sourceAddress + "&key=AIzaSyCxFvOfI3TIp-t_lGYU0o0oD6Uh120miHc";
    var destinationQueryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + destinationAddress + "&key=AIzaSyCxFvOfI3TIp-t_lGYU0o0oD6Uh120miHc";

    // this ajax call will reverse geocode the source location
    $.ajax({
        method: "GET",
        url: sourceQueryURL
    }).then(function (response) {
        sourceLat = response.results[0].geometry.location.lat;
        sourceLong = response.results[0].geometry.location.lng;
        var marker = new google.maps.Marker({
            position: {
                lat: sourceLat,
                lng: sourceLong
            },
            map: map
        });     //close google.maps.Marker()
    });     //close ajax call

    // this ajax call will reverse geocode the destination location
    $.ajax({
        method: "GET",
        url: destinationQueryURL
    }).then(function (response) {
        destinationLat = response.results[0].geometry.location.lat;
        destinationLong = response.results[0].geometry.location.lng;
    })   //close ajax call then function

});         // close go on click function

// ---------------------------------------------------------------------------------
// this is the code to make a map
// ---------------------------------------------------------------------------------

function initMap() {
    var options = {
        zoom: 8,
        center: {
            lat: 30.2672,
            lng: -97.7431
        }
    };
    map = new google.maps.Map(document.getElementById('map'), options);
}       //close initMap()