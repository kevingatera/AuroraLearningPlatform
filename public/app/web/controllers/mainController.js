/* This controller won't go in routes as I need it to have acces too everything
    in the 'myPortfolioApp' */
angular.module('mainController', ['authServices'])
.controller('mainController', function($http, $timeout, $location, Auth, $rootScope, $window){
    // console.log('Testing mainController......OK');
    var app = this;
    /* whenever there is a change of view it will invoke the following
        authentication Check so we make sure the user is still logged in     */
    $rootScope.$on('$routeChangeStart', function(){
        /* Before doing anything in the app opening procedure, check if the user is logged in */
        app.loadContent = false; // Don't show anything until you get everything
        if(Auth.isLoggedIn()) {
            app.loginStatus = true;
            console.log('Success: User is loggedIn');
            // Then get the current user
            Auth.getUserInfo().then(function(data){
                console.log(data.data.username);
                app.username = data.data.username;
                app.usermail = data.data.email;
            })
        } else {
            console.log('Failure: User is NOT logged in');
            app.loginStatus = false;
            app.username = '';
        }
        app.loadContent = true;
        // Re-write the link from facebook to exclude the '_=_' from links from facebook
        if ($location.hash() == '_=_') {
            $location.hash(null);
        }
    });

    // Function to prevent the facebook login buttton from creating a tab each time it's pressed
    this.facebookFix = function() {
        console.log($window.location);
        $window.location = $window.origin + '/auth/facebook';
    }

    // Function to prevent the Twitter login buttton from creating a tab each time it's pressed
    this.twitterFix = function() {
        console.log($window.location);
        $window.location = $window.origin + '/auth/twitter';
    }

    // Function to prevent the Google login buttton from creating a tab each time it's pressed
    this.googleFix = function() {
        console.log($window.location);
        $window.location = $window.origin + '/auth/google';
    }

    // Function to login the user
    this.doLogin = function(loginData){
        // console.log(loginData);
        app.errorMessage = false; // toggle for the message div
        app.loading = true; // toggle for the loading icon
        console.log('Login form submitted ... OK');
        // Always add 'this' i orger to successfully work outside this function
        // console.log(this.loginData);

        /* The following is used to connect to the backend using ""$http"
        the reference is "router.post('/users', function(req, res)"
        which can be found in "~/serverapp/routes/api.js */
        // $http.post('api/users', this.loginData)
        console.log(loginData);
        Auth.login(app.loginData)
            // Execute the code below to do something with the data obtained from server responde
            .then(function(data){
                // console.log(data.data.success);
                // console.log(data.data.message);
                if(data.data.success === true){
                    // Create a success message then redirect to homepage
                    app.successMessage = data.data.message + '... Redirecting';
                    // Then redirect the user to the homepage with a 2sec timeout
                    $timeout(function(){
                        $location.path('/about');
                        // clear the login form so no one can see it
                        /* NOTE: Use {} instead of '' to avoid TypeError */
                        app.loginData = {};
                        app.successMessage = {};
                    }, 2000);
                } else {
                    // Create error message
                    app.errorMessage = data.data.message;
                }
                app.loading = false;
            });
    }

    this.doLogout = function() {
        Auth.logout();
        /* After the user presses logout and the app uses the above function to do then
        redirect the user back to the homepage with a 2sec timeout */
        $location.path('/logout');
        $timeout(function() {
            $location.path('/');
        }, 2000);
    }
})

.config(function() {
    console.log('test mainController');
});
