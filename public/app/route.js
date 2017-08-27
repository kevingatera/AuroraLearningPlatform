var app = angular.module('appRoutes', ['ngRoute','ui.router'])
.config(function($routeProvider, $locationProvider, $stateProvider){

    $routeProvider

    .when('/', {
        templateUrl: 'web/views/pages/home.html',
        authenticated: false
    })

    .when('/about', {
        templateUrl: 'web/views/pages/about.html'
    })

    .when('/contact', {
        templateUrl: 'web/views/pages/contact.html'
    })

    .when('/register', {
        templateUrl: 'web/views/pages/users/register.html',
        controller: 'registrationController',
        controllerAs: 'register', // This is the name to user in your app
        authenticated: false // Is this route used when user is authenticated
    })

    .when('/login', {
        templateUrl: 'web/views/pages/users/login.html',
        authenticated: false
        // controller: ''
    })

    .when('/logout', {
        templateUrl: 'web/views/pages/users/logout.html',
        authenticated: false
    })

    .when('/profile', {
        templateUrl: 'web/views/pages/users/profile.html',
        authenticated: true
    })

    .when('/facebook/:token', {
        templateUrl: 'web/views/pages/users/social/social.html',
        controller: 'facebookController',
        controllerAs: 'facebook',
        authenticated: true
    })

    .when('/fberror', {
        templateUrl: 'web/views/pages/users/login.html',
        controller: 'facebookController',
        controllerAs: 'facebook',
        authenticated: false
    })

    .when('/twitter:token', {
        templateUrl: 'web/views/pages/users/login.html',
        controller: 'twitterController',
        controllerAs: 'twitter',
        authenticated: false
    })

    .when('/twittererror', {
        templateUrl: 'web/views/pages/users/login.html',
        controller: 'googleController',
        controllerAs: 'google',
        authenticated: false
    })

    .when('/google:token', {
        templateUrl: 'web/views/pages/users/login.html',
        controller: 'googleController',
        controllerAs: 'google',
        authenticated: false
    })

    .when('/googleerror', {
        templateUrl: 'web/views/pages/users/login.html',
        controller: 'facebookController',
        controllerAs: 'facebook',
        authenticated: false
    })

    // Dashboard routes

    .when('/dashboard', {
        templateUrl: 'web/views/pages/users/dashboard/dashboard.html',
        authenticated: true
    })



    /* .when('/tinymce', {
        templateUrl:'web/views/pages/users/tools/tinymce.html',
        controller: 'tinymceController'
    }) */


    // The default Route

    .otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode({ // This is used to remove the # sign from url
        enabled: true,
        requireBase: false
    });

    $stateProvider

    // .state('dashboard', {
    //     // url: '/dashboard'
    //     // templateUrl: 'web/views/pages/users/dashboard/dashboard.html',
    //     // authenticated: true
    // })

    .state('tinymce', {
        url: '/tinymce',
        templateUrl: "web/views/pages/users/tools/tinymce.html",
        controller: 'tinymceController'
    });



});


// Restricting certain routes or pages and checking if those rules are followed
app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        // console.log(Auth.isLoggedIn());
        // Check what should be accessed when the user is already authenticated
        if(next.$$route.authenticated === true){
            if(!Auth.isLoggedIn()){
                // Prevent access if not authenticated
                event.preventDefault();
                // redirect to a home instead of an empty window
                $location.path('/');
            }
        }
        // Check what should be accessed when the user is NOT authenticated
        else if (next.$$route.authenticated === false) {
          if(Auth.isLoggedIn()){
            event.preventDefault();
            $location.path('/dashboard')
            }
        }
        /* ..... ADDITIONS NEEDED TO TAKE CARE OF THE Cannot Read property of undefined */
    })
}])

/*
app.controller("MyCtrl", function($ocLazyLoad) {
  $ocLazyLoad.load(() => {alert('Yes')}));
}); */

// console.log('ROUTE.js file... OK');
