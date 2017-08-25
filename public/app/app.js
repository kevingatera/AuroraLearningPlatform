// console.log('Testing APP.js file');

angular.module("myPortfolioApp", [
    'appRoutes',
    'mainController',
    'authServices',
    'userControllers',
    'userServices',
    'ngAnimate', // this is for angular-animate
]).config(function($httpProvider) {
    /* use $httpProvider to intercept all http requests and use
        AuthInterceptorsFactory to append a token to each and every one of them */
    $httpProvider.interceptors.push('AuthInterceptors');
    console.log('testing the user app');
});
