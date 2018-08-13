var config = {
    apiKey: "AIzaSyDEvJrGrHAu6pULP7sm3zaQEkWNjkna6B4",
    authDomain: "car-pool-demo.firebaseapp.com",
    databaseURL: "https://car-pool-demo.firebaseio.com",
    projectId: "car-pool-demo",
    storageBucket: "car-pool-demo.appspot.com",
    messagingSenderId: "319711369578"
};
firebase.initializeApp(config);
var database = firebase.database();
var map;
var sourceLat, sourceLong, destinationLat, destinationLong;
var name, source, destination, username, userStatus;
var drivingStatus = true;
var usernameArray = [];
var flag = true;
var temp, humidity, wind, contentString, infowindow;
database.ref().on("child_added", function (snap) {
    usernameArray.push(snap.val().username);
});

$("#option-rider").on('click', function () {
    
    drivingStatus = false;
})
$("#option-driver").on('click', function () {
    
    drivingStatus = true;
});

$("#go").on('click', function (event) {
    event.preventDefault();
    $("#go").attr("disabled", "disabled");
    for (var i = 0; i < usernameArray.length; i++) {
        if ($("#username").val() === usernameArray[i]) {
            flag = false;
        }
    }
    if (flag === true) {
        name = $("#name").val().trim();
        source = $("#sourceLocation").val().trim();
        destination = $("#destinationLocation").val().trim();
        username = $("#username").val().trim();
        userStatus = drivingStatus;
        var sourceAddress = source;
        var destinationAddress = destination;
        var sourceQueryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + sourceAddress + "&key=AIzaSyCxFvOfI3TIp-t_lGYU0o0oD6Uh120miHc";
        var destinationQueryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + destinationAddress + "&key=AIzaSyCxFvOfI3TIp-t_lGYU0o0oD6Uh120miHc";


        $.ajax({
            method: "GET",
            url: sourceQueryURL
        }).then(function (response) {
            sourceLat = response.results[0].geometry.location.lat;
            sourceLong = response.results[0].geometry.location.lng;
            console.log(sourceLat);
            console.log(sourceLong);


            $.ajax({
                method: "GET",
                url: destinationQueryURL
            }).then(function (response) {
                destinationLat = response.results[0].geometry.location.lat;
                destinationLong = response.results[0].geometry.location.lng;
                pushToFirebase();
                
            });     //close nested ajax call for destination
        });     //close ajax call
    }       //close if flag=true
    else {
        alert("try different username");
    }
});         //clode click() on go button

// var marker = new google.maps.Marker({
//     position: {
//         lat: sourceLat,
//         lng: sourceLong
//     },
//     map: map
// });     //close google.maps.Marker()     


function pushToFirebase() {
    database.ref().push({
        name: name,
        sourceLatitude: sourceLat,
        sourceLongitude: sourceLong,
        destinationLatitude: destinationLat,
        destinationLongitude: destinationLong,
        username: username,
        userDrivingStatus: userStatus
        // online: online,
    });

}
database.ref().on("child_added", function(snapshot){
        if(snapshot.val().username === username){
            var locationlat = snapshot.val().destinationLatitude;
            var locationlng = snapshot.val().destinationLongitude;
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat="+locationlat+"&lon="+locationlng+"&appid=166a433c57516f51dfab1f7edaed8413";
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response){
                console.log(response.main.temp);
                console.log(response.main.humidity);
                console.log(response.wind.speed);
                temp = response.main.temp;
                humidity = response.main.humidity;
                wind = response.wind.speed;
                contentString='<div><h5>Destination Loaction:</h5><p>Temperature: '+temp+'</p><p>Humidity: '+humidity+'<p>Wind Speed: '+wind+'</p></div>';
                infowindow = new google.maps.InfoWindow({
                    content: contentString
                  });
            });
        }
    })

database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val().username);
    if (snapshot.val().username === username) {
        var sourcemarker = new google.maps.Marker({
            position: {
                lat: snapshot.val().sourceLatitude,
                lng: snapshot.val().sourceLongitude
            },
            title: "You are here",
            map: map
        });
        var destinationmarker = new google.maps.Marker({
            position: {
                lat: snapshot.val().destinationLatitude,
                lng: snapshot.val().destinationLongitude
            },
            title: "You are here",
            map: map
        });   
        destinationmarker.addListener('click', function() {
            infowindow.open(map, destinationmarker);
          });
    }
    else{
        var icon = {
            url: "pin.png", // url
            scaledSize: new google.maps.Size(25, 25), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        var marker = new google.maps.Marker({
            position: {
                lat: snapshot.val().sourceLatitude,
                lng: snapshot.val().sourceLongitude
            },
            icon:icon,
            title: "i am a friend",
            map: map
        });
    }
});         //close child_added snapshot()


// database.ref().on("child_added", function(snapshot){
//     if(snapshot.val().username === username){
//         var locationlat = snapshot.val().destinationLatitude;
//         var locationlng = snapshot.val().destinationLongitude;
//         var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat="+locationlat+"&lon="+locationlng+"&appid=166a433c57516f51dfab1f7edaed8413";
//         $.ajax({
//             url: queryURL,
//             method: "GET"
//         }).then(function(response){
//             console.log(response.main.temp);
//             console.log(response.main.humidity);
//             console.log(response.wind.speed);
//             temp = response.main.temp;
//             humidity = response.main.humidity;
//             wind = response.wind.speed;
//         });
//     }
// })


// }

//   $(".form-control").val('');






// $("#go").on("click", function (event) {
//     event.preventDefault(event);
// var sourceAddress = $("#sourceLocation").val();

// var destinationAddress = $("#destinationLocation").val();
// var sourceQueryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + sourceAddress + "&key=AIzaSyCxFvOfI3TIp-t_lGYU0o0oD6Uh120miHc";
// var destinationQueryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + destinationAddress + "&key=AIzaSyCxFvOfI3TIp-t_lGYU0o0oD6Uh120miHc";

// this ajax call will reverse geocode the source location
// $.ajax({
//     method: "GET",
//     url: sourceQueryURL
// }).then(function (response) {
//     sourceLat = response.results[0].geometry.location.lat;
//     sourceLong = response.results[0].geometry.location.lng;
//     var marker = new google.maps.Marker({
//         position: {
//             lat: sourceLat,
//             lng: sourceLong
//         },
//         map: map
//     });     //close google.maps.Marker()
// });     //close ajax call

// this ajax call will reverse geocode the destination location
// $.ajax({
//     method: "GET",
//     url: destinationQueryURL
// }).then(function (response) {
//     destinationLat = response.results[0].geometry.location.lat;
//     destinationLong = response.results[0].geometry.location.lng;
// })   //close ajax call then function

// });         // close go on click function

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