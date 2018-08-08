<!-- # Team8Project1 -->
Our First Project Team 8
Team Members:
  Momin Ahmad
  Spencer Vigil
  Nanette Labrada
  Sanjana 

  //

Project Title - working title done

Team Members - done

Sanjan Tripathi
Spencer Vigil
Momin Amad
Nanette Labrada

Project Description - working Description done

Sketch of Final Product - in process

APIs to be Used - done

Rough Breakdown of Tasks  - 

Sanjan Tripathi - Javascript API ajax
Spencer Vigil - Create Layout of Site 
Momin Amad - Creating Database using firebase 
Nanette Labrada - CSS


Name = Carpool Consolidation // Carpool Collective // 

Description: Match with your nearby neighbors who also work in the same area. This will keep track of your schedule and who has contributed to the carpool.

Team Members =

Sanjan Tripathi
Spencer Vigil
Momin Amad
Nanette Labrada

Pages:
    1. Sign-up/Sign-in
    2. Profile
    3. Home page - driver
    4. Home page - rider
    5. History
//Development Stages
Stage 1: HTML
    create all the html pages necessary
Stage 2: Javascript - Make the buttons function
    sign-in/sign-up, driver/rider, connect/accept
Stage 3: ajax - call APIs
    LinkedIn API : sign-in with linkedIn
                   normal signup - populate info from linkedIn
                   https://developer.linkedin.com/docs/guide/v2/people/profile-api
                   <!-- <script async defer src=" https://api.linkedin.com/v2/people/(id:{person ID}) -->

    Google Maps API : distance from starting point to destination
                      show people (riders/drivers) near you
                      https://developers.google.com/maps/documentation/
                      <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"type="text/javascript"></script>
                      API Key = "AIzaSyAnIlFyy5-En2_kBfAWSoQ_AENy1fc1ix8"
  
Stage 4: Firebase DB & Calculations
    Create object for each user
    Calculate distance from starting point to destination
    Calculate fuel cost shared
Stage 5: Finish-Line
    Display data on page
//Data/Information
    1. Sign-up
        -Name* 
        -User Name*
        -Password*
        -LinkedIn Profile (link or connect checkbox)
        -Sign up with LinkedIn
        -Use same username & Password as LinkedIn (or may ask for new)
    
    2.  Profile
        -Name
        -username
        -LinkedIn Profile (link)
    3.  History
        -Trip taken
            -Companion
            -Source
            -destination
            -Fuel/mile : $
            -Cost Incurred : $   
    4.  Home Page : Driver/rider
        -Status (Rider/Driver)
            -Rider
                Source: <your location>
                Destination: <enter location>
                Drivers near you
                    -option to connect
            -Driver
                Source: <your location>
                Destination: <enter location>
                Riders near you
                    -option to respond to connect requests
    
//Logic
    -sign-up/in with a unique username and Password
    -make sure your status is correct (rider/driver)
    -status can be switched anytime
    -Rider:
        -if your source location and destination is in 0.5 miles radius of those of another member who is a driver, you will see him/her on your homepage.
        -connect with him/her
        -if your request is accepted - modal comes up saying "Enjoy your ride together!" with details of fuel cost.
        -Fuel cost is determined using the distance between source and destination and mileage of the car 
        -Fuel cost is equally distributed between the rider and driver
    -Driver
        -if your source location and destination is in 0.5 miles radius of those of another member who is a rider, you will see him/her on your homepage.
        -if a rider tries to connect with you, you can accept their request from the home page.
        -modal comes up saying "Enjoy your ride together!" with details of fuel cost.
        -Fuel cost is determined using the distance between source and destination and mileage of the car 
        -Fuel cost is equally distributed between the rider and driver
