// -------------------------------------------------------------------------
// validation script
// -------------------------------------------------------------------------
(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();

  $("#usertable").hide();
// -------------------------------------------------------------------------
// initialize firebase
// -------------------------------------------------------------------------
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
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
// -------------------------------------------------------------------------
// declare variables
// -------------------------------------------------------------------------
var map;
var sourceLat, sourceLong, destinationLat, destinationLong;
var name, contact, source, destination, username, userStatus;
var drivingStatus = "driver";
var usernameArray = [];
var flag = true;
var check=true;
var temp, humidity, wind, contentString, infowindow;
var lat=null;
var lng=null;


// -------------------------------------------------------------------------
// change the drivingStatus of the user based on which option he/she choses
// -------------------------------------------------------------------------

$("#rider").on('click', function () {
    
    drivingStatus = "rider";
    
})
$("#driver").on('click', function () {

    drivingStatus = "driver";
});

//for each child added push their username in the usernameArray
database.ref("connectedRef").on("child_added", function (snap) {
    usernameArray.push(snap.val().username);
});
// -------------------------------------------------------------------------
// on click of Go button do the following
// -------------------------------------------------------------------------
$("#go").on('click', function (event) {
    event.preventDefault();
    $("#userform").hide();
    $("#usertable").show();
    // after one entry disable the go button to prevent the user from modifying the entries 
    // $("#go").attr("disabled", "disabled");
    //check if username is unique depending on the values in usernameArray
    for (var i = 0; i < usernameArray.length; i++) {
        
        if (($("#username").val() === usernameArray[i]) || (($("#username").val()).length < 4)) {
            flag = false;
        }
    }
    console.log($("#name").val());
    if(($("#name").val().trim() === null)||($("#name").val().trim() === "") || ($("#username").val().trim() === "")|| ($("#username").val().trim() === null) || ($("#contact").val().trim() === "")||($("#contact").val().trim() === null) || ($("#sourceLocation").val() === null)||($("#sourceLocation").val() === "") || ($("#destinationLocation").val() === null)||($("#destinationLocation").val() === "") ){
        
        check = false;
    }
    if (flag === true && check === true) {
        // read data from the form
        name = $("#name").val().trim();
        contact = $("#contact").val().trim();
        source = $("#sourceLocation").val().trim();
        destination = $("#destinationLocation").val().trim();
        username = $("#username").val().trim();
        userStatus = drivingStatus;
        //urls & ajax call for reverse geo coding the surce and destination of the user
        var sourceQueryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + source + "&key=AIzaSyCxFvOfI3TIp-t_lGYU0o0oD6Uh120miHc";
        var destinationQueryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&key=AIzaSyCxFvOfI3TIp-t_lGYU0o0oD6Uh120miHc";
        $.ajax({
            method: "GET",
            url: sourceQueryURL
        }).then(function (response) {
            sourceLat = response.results[0].geometry.location.lat;
            sourceLong = response.results[0].geometry.location.lng;
            $.ajax({
                method: "GET",
                url: destinationQueryURL
            }).then(function (response) {
                destinationLat = response.results[0].geometry.location.lat;
                destinationLong = response.results[0].geometry.location.lng;
                pushToFirebase();       //push the data of the user to firebase
                //for each child in the database other than the user calculate their distance from user and display a marker
                database.ref("connectedRef").on("child_added", function (snap) {
                    if (snap.val().username != username) {
                        var destLat = snap.val().destinationLatitude;
                        var destLng = snap.val().destinationLongitude;
                        var distanceURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + sourceLat + "," + sourceLong + "&destinations=" + destLat + "," + destLng + "&key=AIzaSyCxFvOfI3TIp-t_lGYU0o0oD6Uh120miHc";
                        var proxyUrl = "https://cors-ut-bootcamp.herokuapp.com/"
                        var targetUrl = distanceURL;
                        lat = snap.val().sourceLatitude;
                        lng = snap.val().sourceLongitude;
                        var markerinfowindow, markerContentString;
                        $.get(proxyUrl + targetUrl, function (data) {
                            console.log(data);
                            var distance = data.rows[0].elements[0].distance.text;
                            var distancemet = data.rows[0].elements[0].distance.value;
                            var userdestination = snap.val().destination;
                            var nameofuser = snap.val().name;
                            var usercontact = snap.val().contact;
                            var isUserDriving = snap.val().userDrivingStatus;
                            var tr = $("<tr>");
                            var tdname = $("<td>");
                            tdname.text(nameofuser);
                            var tdcontact = $("<td>");
                            tdcontact.text(usercontact);
                            var tddistance = $("<td>");
                            tddistance.text(distance);
                            var tddestination = $("<td>");
                            tddestination.text(userdestination);
                            var tddrivingstatus = $("<td>");
                            tddrivingstatus.text(isUserDriving);
                            tr.append(tdname).append(tdcontact).append(tddrivingstatus).append(tddistance).append(tddestination);
                            if(distancemet <= 5000){
                            $("#usertablebody").append(tr);}
                            });
                        var markerContentString = "<div><h5>User Driving Status: " + snap.val().userDrivingStatus + "</h5><p>Username: " + snap.val().username + "</p></div>";
                        var markerinfowindow = new google.maps.InfoWindow({
                            content: markerContentString
                        });     //close infowindow
                        var icon = {
                            url: "pin.png", // url
                            scaledSize: new google.maps.Size(25, 25), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                        };
                        var marker = new google.maps.Marker({
                            position: {
                                lat: lat,
                                lng: lng
                            },
                            icon: icon,
                            title: "I am a friend",
                            map: map
                        });
                        marker.addListener('click', function () {
                            markerinfowindow.open(map, marker);
                        });

                    }   //close if

                }); //close on child_added
            });     //close nested ajax call for destination
        });     //close ajax call
    }       //close if flag=true
    else if(flag === false && check === true) {
        // $(".form-control").val('');
        $('#usernameModal').modal({
            backdrop: "static"
        });
        $(".form-control").val('');
        
    }
    
    else if(check === false){
        $("#fieldsEmptyModal").modal({
            backdrop: "static"
        });
        $(".form-control").val('');
        
    }
    // //     // $(".form-control").val('');
});         //clode click() on go button



function pushToFirebase() {
    database.ref("connectedRef").push({
        name: name,
        contact: contact,
        source: source,
        sourceLatitude: sourceLat,
        sourceLongitude: sourceLong,
        destination: destination,
        destinationLatitude: destinationLat,
        destinationLongitude: destinationLong,
        username: username,
        userDrivingStatus: userStatus,
        connectionStatus: true
    });

}
// var myConnection = null;


// for the current user display a marker for destination & the weather info there
database.ref("connectedRef").on("child_added", function (snapshot) {
    // console.log("test: " +username);
    if (snapshot.val().username === username) {
        // var driverStatus = snapshot.val().userDrivingStatus;
        var locationlat = snapshot.val().destinationLatitude;
        var locationlng = snapshot.val().destinationLongitude;
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + locationlat + "&lon=" + locationlng + "&appid=166a433c57516f51dfab1f7edaed8413";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            temp = response.main.temp;
            humidity = response.main.humidity;
            wind = response.wind.speed;
            contentString = '<div><h5>Destination Location:</h5><p>Temperature: ' + temp + '</p><p>Humidity: ' + humidity + '<p>Wind Speed: ' + wind + '</p></div>';
            infowindow = new google.maps.InfoWindow({
                content: contentString
            });     //close infowindow
        });   //close ajax
        var icon = {
            url: "green.png", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
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
            icon: icon,
            title: "This is your destination",
            map: map
        });
        destinationmarker.addListener('click', function () {
            infowindow.open(map, destinationmarker);
        });

    }  //close if(username condition)
}); //close child_added
    // lat = snapshot.val().sourceLatitude;
    // lng = snapshot.val().sourceLongitude;
    // myConnection = connectionsRef.push(snapshot.val().username);

    // addMarker(lat, lng);
    // myConnection.onDisconnect().remove();

    // connectionsRef.on("value", function (snap) {
    

        // var markerContentString = "<div><h5>User Driving Status: " + snapshot.val().userDrivingStatus + "</h5><p>Username: " + snapshot.val().username + "</div>";
        // var markerinfowindow = new google.maps.InfoWindow({
        //     content: markerContentString
        // });     //close infowindow
        // var icon = {
        //     url: "pin.png", // url
        //     scaledSize: new google.maps.Size(25, 25), // scaled size
        //     origin: new google.maps.Point(0, 0), // origin
        //     anchor: new google.maps.Point(0, 0) // anchor
        // };
        // var marker = new google.maps.Marker({
        //     position: {
        //         lat: lat,
        //         lng: lng
        //     },
        //     icon: icon,
        //     title: "i am a friend",
        //     map: map
        // });
        // marker.addListener('click', function () {
        //     markerinfowindow.open(map, marker);
        // });

    
    // });
// })  //close on child_added()



// database.ref("connectedRef").on("child_added", function (snapshot) {

//     if (snapshot.val().username === username) {
//         var sourcemarker = new google.maps.Marker({
//             position: {
//                 lat: snapshot.val().sourceLatitude,
//                 lng: snapshot.val().sourceLongitude
//             },
//             title: "You are here",
//             map: map
//         });

//         var destinationmarker = new google.maps.Marker({
//             position: {
//                 lat: snapshot.val().destinationLatitude,
//                 lng: snapshot.val().destinationLongitude
//             },
//             title: "This is your destination",
//             map: map
//         });
//         destinationmarker.addListener('click', function () {
//             infowindow.open(map, destinationmarker);
//         });
//     }
// });         //close child_added snapshot()


// database.ref("connectedRef").on("child_added", function (snapshot) {
//     // console.log(snapshot.key);
//     lat = snapshot.val().sourceLatitude;
//     lng = snapshot.val().sourceLongitude;
//     // if (snapshot.val().username !== username) {
//     myConnection = connectionsRef.push(snapshot.val().username);

//     // addMarker(lat, lng);
//     myConnection.onDisconnect().remove();
//     // connectedRef.onDisconnect().update({
//     //     connectionStatus: false
//     // });
//     // connectionsRef.on("value", function(snap){      
//     //     addMarker(lat, lng);
//     // });
//     //    }
//     connectionsRef.on("value", function (snap) {
//         if (snapshot.val().username !== username) {
//             addMarker(lat, lng);
//         }
//     });
// });


// function addMarker(lat, lng) {
//     var icon = {
//         url: "pin.png", // url
//         scaledSize: new google.maps.Size(25, 25), // scaled size
//         origin: new google.maps.Point(0, 0), // origin
//         anchor: new google.maps.Point(0, 0) // anchor
//     };
//     var marker = new google.maps.Marker({
//         position: {
//             lat: lat,
//             lng: lng
//         },
//         icon: icon,
//         title: "i am a friend",
//         map: map
//     });
//     marker.addListener('click', function () {
//         markerinfowindow.open(map, marker);
//     });
// }




// database.ref("connectedRef").on("child_added", function (snapshot) {

//     var destLat = snapshot.val().destinationLatitude;
//     var destLng = snapshot.val().destinationLongitude;

//     var distanceURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Texas_State_University_round_rock&destinations=college_station&key=AIzaSyCxFvOfI3TIp-t_lGYU0o0oD6Uh120miHc";
//     $.ajax({
//         url: distanceURL,
//         method: "GET"
//     }).then(function (response) {
//         temp = response.main.temp;
//         humidity = response.main.humidity;
//         wind = response.wind.speed;
//         contentString = '<div><h5>Destination Loaction:</h5><p>Temperature: ' + temp + '</p><p>Humidity: ' + humidity + '<p>Wind Speed: ' + wind + '</p></div>';
//         infowindow = new google.maps.InfoWindow({
//             content: contentString
//         });

//     });

// }
// });

//-----------------------------------------------------------------------------
//initMap() initializes the google map 
//-----------------------------------------------------------------------------

function initMap() {
    var options = {
        zoom: 8,
        center: {
            lat: 30.2672,
            lng: -97.7431
        }
    };
    map = new google.maps.Map(document.getElementById('map'), options);
}