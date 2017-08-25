/* This is the controller which is connected to the registration page */

angular.module('userControllers', ['userServices']).controller('registrationController', function($http, $location, $timeout, oneUser) { // Pass in '$http'
    var app = this;
    this.registerUser = function(registrationData, valid) {
        console.log(registrationData);
        app.errorMessage = false; // toggle for the message div
        app.loading = true; // toggle for the loading icon
        // Always add 'this' i orger to successfully work outside this function
        // console.log(this.registrationData);

        /* The following is used to connect to the backend using ""$http"
        the reference is "router.post('/users', function(req, res)"
        which can be found in "~/serverapp/routes/api.js */
        // $http.post('api/users', this.registrationData)
        console.log(registrationData);

        if (valid) {
            oneUser.create(app.registrationData)
            // Execute the code below to do something with the data obtained from server responde
                .then(function(data) {
                // console.log(data.data.success);
                // console.log(data.data.message);
                if (data.data.success === true) {
                    // Create a success message then redirect to homepage
                    app.successMessage = data.data.message + '... Redirecting';
                    // Then redirect the user to the homepage with a 2sec timeout
                    $timeout(function() {
                        $location.path('/');
                    }, 2000);
                    console.log('Registration Form submitted ... OK');
                } else {
                    // Create error message
                    app.errorMessage = data.data.message;
                }
                app.loading = false;
            });
        } else {
            app.loading = false;
            app.errorMessage = 'Please ensure form is properly filled'
        }

    };

    // This will manipulae the feedback the user gets after inputing a username during registration
    this.checkUsername = function(registrationData) {
      app.checkingUsername = true; // this will act as a loading switch
      app.usernameMessage = false; // clear the previous value
      app.usernameInvalid = false; // clear the previous value
        oneUser.checkUsername(app.registrationData).then(function(data) {
          if(data.data.success){
            app.usernameInvalid = false; // assign it a new value
            app.usernameMessage = data.data.message;
          } else {
            app.usernameInvalid = true;  // assign it a new value
            app.usernameMessage = data.data.message;
          }
          app.checkingUsername = false; // clear the previous value
        })
    }

    // This will manipulate the feedback the user gets after inputing an email during registration
    this.checkEmail = function(registrationData) {
      app.checkingEmail = true; // this will act as a loading switch
      app.emailMessage = false; // clear the previous value
      app.emailInvalid = false; // clear the previous value
        oneUser.checkEmail(app.registrationData).then(function(data) {
          if(data.data.success){
            app.emailInvalid = false; // assign it a new value
            app.emailMessage = data.data.message;
          } else {
            app.emailInvalid = true;  // assign it a new value
            app.emailMessage = data.data.message;
          }
          app.checkingEmail = false; // clear the previous value
        })
    }
})

// Facebook login mechanism
    .controller('facebookController', function($routeParams, Auth, $location, $window) {
    var app = this; // declare app as we will use it
    console.log('Testing facebook controller.... OK');
    if ($window.location.pathname === '/fberror') {
        // return error variable because login failed
        app.errorMessage = 'Facebook email NOT found in database';
    } else {
        /* The following will use the Auth.facebook function to login the user after */
        console.log('The token: ' + $routeParams.token)
        Auth.facebook($routeParams.token);
        // Redirect the user to the home page
        $location.path('/');
    }
})

// Twitter Login mechanism
    .controller('twitterController', function($routeParams, Auth, $location, $window) {
    var app = this; // declare app as we will use it
    console.log('Testing twitterController.... OK');
    if ($window.location.pathname === '/twittererror') {
        // return error variable because login failed
        app.errorMessage = 'Twitter email NOT found in database';
    } else {
        /* The following will use the Auth.facebook function to login the user after */
        console.log('The token: ' + $routeParams.token)
        Auth.twitter($routeParams.token);
        // Redirect the user to the home page
        $location.path('/');
    }
})

// Google Login mechanism
    .controller('googleController', function($routeParams, Auth, $location, $window) {
    var app = this; // declare app as we will use it
    console.log('Testing googleController.... OK');
    if ($window.location.pathname === '/googleerror') {
        // return error variable because login failed
        app.errorMessage = 'Google email NOT found in database';
    } else {
        /* The following will use the Auth.facebook function to login the user after */
        console.log('The token: ' + $routeParams.token)
        Auth.google($routeParams.token);
        // Redirect the user to the home page
        $location.path('/');
    }
})

/*
    .config(function(){
        console.log('Testing USERCONTROL');
    });
*/
