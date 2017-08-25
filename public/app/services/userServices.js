/* The following is used to create users */

angular.module('userServices', [])
.factory('oneUser', function($http){
    userFactory = {};

    // Will look like User.create(registrationData)
    userFactory.create = function(registrationData) {
        return $http.post('api/users', registrationData);
    }

    // Will look like User.checkUsername(registrationData)
    userFactory.checkUsername = function(registrationData) {
        return $http.post('api/checkUsername', registrationData);
    }

    // Will look like User.checkEmail(registrationData)
    userFactory.checkEmail = function(registrationData) {
        return $http.post('api/checkEmail', registrationData);
    }
    return userFactory;

});
