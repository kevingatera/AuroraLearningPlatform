angular.module('authServices', [])
.factory('Auth', function($http, AuthToken){
    var authFactory = {};
    /* Below is the declaration of a custom application to be used
        throughout my whole webapp */
    authFactory.login = function(loginData) {
        // console.log('Test userServices.... OK');
        /* This will authenticate the user on the server then set the token in the browser's storage */
        return $http.post('api/authenticate', loginData).then(function(data){
            AuthToken.setToken(data.data.token);
            return data;
        });
    };

    /* The following will tell us f the user is logged in
        Access it using: Auth.isLoggedIn() */
    authFactory.isLoggedIn = function() {
        if(AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    };

    /* The folowing will be used to authenticate users from Facebook */
    authFactory.facebook = function(token) {
        // Authenticate using the token
        AuthToken.setToken(token);
    }

    /* The folowing will be used to authenticate users from twitter */
    authFactory.twitter = function(token) {
        // Authenticate using the token
        AuthToken.setToken(token);
    }

    /* The folowing will be used to authenticate users from Google */
    authFactory.google = function(token) {
        // Authenticate using the token
        AuthToken.setToken(token);
    }

    /* How to handle the server response when it's presented a token */
    authFactory.getUserInfo = function() {
        if(AuthToken.getToken()){
            return $http.post('/api/me');
        } else {
            // Use Angular to reject the response if the user has no token
            $q.reject({ message: 'The user has no Token' });
        }
    }

    /* Logout mechanism */
    authFactory.logout = function(){
        AuthToken.setToken();
    }

    return authFactory;
})
.factory('AuthToken', function($window){
    /* CREATE An AUTHENTICATION TOKEN FACTORY */
    var authTokenFactory ={};
    //  authTokenFactory.setToken(token);
    /* Create a custom function for setting tokens (AuthToken.setToken(token))
       and when I invoke the following it will save the token in the local storage of browser */
    authTokenFactory.setToken = function(token) {
        if(token){ // if a token is passed the save it to the browser storage
            $window.localStorage.setItem('token', token);
        } else { // else destroy it for the sake of loging out
            $window.localStorage.removeItem('token');
        }
    };

    // The following is a method used on the fronted in order to get the token value from the server's response
    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory;
})
.factory('AuthInterceptors', function(AuthToken){
    // This function will append tokens to every request
    var AuthInterceptorsFactory = {} // create it as an Object;

    AuthInterceptorsFactory.request = function(config){
        var token = AuthToken.getToken(); // Check if the token exists

        if(token) {
            config.headers['x-access-token'] = token;
        }

        return config;
    }

    return AuthInterceptorsFactory;
})
;
