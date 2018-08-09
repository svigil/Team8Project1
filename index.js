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

  var option = false;

  $("#option-rider").on('click', function(){
    if (option === true) {
      option === false;
    } else {
      return false;
    }
  })
  $("#option-driver").on('click', function(){
    if (option === false) {
      option === true;
    } else {
      return true;
    }
  })

  // (function() {
  //   'use strict';
  //   window.addEventListener('load', function() {
  //     // Fetch all the forms we want to apply custom Bootstrap validation styles to
  //     var forms = document.getElementsByClassName('needs-validation');
  //     // Loop over them and prevent submission
  //     var validation = Array.prototype.filter.call(forms, function(form) {
  //       form.addEventListener('submit', function(event) {
  //         if (form.checkValidity() === false) {
  //           event.preventDefault();
  //           event.stopPropagation();
  //         }
  //         form.classList.add('was-validated');
  //       }, false);
  //     });
  //   }, false);
  // })();
  
  $("#sign-up").on('click', function(event){
    event.preventDefault();
    user = {
      name: $("#exampleInputEmail1").val().trim(),
      source: $("#exampleInputPassword1").val().trim(), 
      option,
      // location: ,
      // type:,
      
    }
    if (user.name == '' || user.source == ''){

      alert("it works");
      return false;
    } else {
      
      


      // function writeUserData() {
      //   firebase.database().ref('users/' + userId).set({
      //     username: name,
      //     email: email,
      //     profile_picture : imageUrl
      //   });
      // }
      
      database.ref().push({
        user
      })
    }

      $(".form-control").val('');
    })

    database.ref().on("child_added", function(snapshot){
        console.log(snapshot.val().user.name);
        console.log(snapshot.val().user.source);
        console.log(snapshot.val().user.option);
    })



      
      
      
      
  