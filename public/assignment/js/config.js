/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
angular
    .module('FormMakerApp')
    .config(['$routeProvider',
        function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home',
            {

                templateUrl: './views/home/home.view.html',
                controller: "HomeController"
            })
        .when('/admin',
            {

                templateUrl: './views/admin/admin.view.html',
                controller: "AdminController"
            })
        .when('/forms',
            {
                templateUrl: './views/forms/forms.view.html',
                controller: "FormsController"
            })
        .when('/forms-fields',
            {
                templateUrl: './views/forms/forms-fields.view.html',
                controller: "FormsFieldsController"
            })
        .when('/profile',
            {
                templateUrl: './views/users/profile.view.html',
                controller: "ProfileController"
            })
        .when('/login',
            {
                templateUrl: './views/users/login.view.html',
                controller: "LoginController"
            })
        .when('/register',
            {
                templateUrl: './views/users/register.view.html',
                controller: "RegisterController"
            })
        .otherwise({
            redirectTo: '/home'
        });

            $locationProvider.html5Mode(true);

}]);