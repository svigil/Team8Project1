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



  $("#sign-up").on('click', function(event){
      event.preventDefault();
      username = $("#exampleInputEmail1").val().trim();
      password = $("#exampleInputPassword1").val().trim();

      database.ref().push({
        username: username,
        password: password,
      })

      $(".form-control").val('');
    })

    database.ref().on("child_added", function(snapshot){
        console.log(snapshot.val().username);
        console.log(snapshot.val().password);
    })



      
      
      
      
  