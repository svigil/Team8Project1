var config = {
    apiKey: "AIzaSyCLwDRlKDkYHz4QH1QwFbJx_MPsoA1m58Y",
    authDomain: "carpool-f4afb.firebaseapp.com",
    databaseURL: "https://carpool-f4afb.firebaseio.com",
    projectId: "carpool-f4afb",
    storageBucket: "carpool-f4afb.appspot.com",
    messagingSenderId: "617867932176"
  };
  
  firebase.initializeApp(config);

  var database = firebase.database();
  var connectionsRef = database.ref("/connections");
  var connectedRef = database.ref(".info/connected");

  connectedRef.on("value", function(snap){
    if (snap.val()){
      var con = connectionsRef.push(true);
      con.onDisconnect().remove();
    }
  })

  connectionsRef.on("value", function(snap) {
    console.log(snap.numChildren());
  })

  var option = false;

  $("#option-rider").on('click', function(){
    // alert("works");
    if (option === true) {
      option = false;
    } else {
      return false;
    }
  })
  $("#option-driver").on('click', function(){
    // alert("works");
    if (option === false) {
      option = true;
    } else {
      return true;
    }
  })
 
  
  $("#sign-up").on('click', function(event){
    event.preventDefault();
      name = $("#validationCustom01").val().trim();
      source = $("#validationCustom02").val().trim();
      destination = $("#validationCustom03").val().trim();
      userOption = option;
      online = true;
    
    if (name == '' || source == ''){

      alert("it works");
      return false;
    } else {
      
    // need to remove user on disconnect   
      database.ref("/userlocation").push({
        name: name,
        source: source,
        destination: destination,
        userOption: userOption,
        online: online,

      })
    }

      $(".form-control").val('');
    })

    database.ref("/userlocation").on("child_added", function(snapshot){
        console.log(snapshot.val().name);
        console.log(snapshot.val().source);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().userOption);
        console.log("online: " + snapshot.val().online);
    })





      
      
      
      
  