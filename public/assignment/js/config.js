/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function() {
    angular
        .module('FormMakerApp')
        .config(function ($routeProvider, $locationProvider) {
                $routeProvider
                    .when('/home',
                        {
                            templateUrl: 'assignment/views/home/home.view.html',
                            controller: 'HomeController'
                        })
                    .when('/admin',
                        {

                            templateUrl: 'assignment/views/admin/admin.view.html',
                            controller: 'AdminController'
                        })
                    .when('/forms',
                        {
                            templateUrl: 'assignment/views/forms/forms.view.html',
                            controller: 'FormsController'
                        })
                    .when('/form-fields',
                        {
                            templateUrl: 'assignment/views/forms/form-fields.view.html',
                            controller: 'FormsFieldsController'
                        })
                    .when('/profile',
                        {
                            templateUrl: 'assignment/views/users/profile.view.html',
                            controller: 'ProfileController'
                        })
                    .when('/login',
                        {
                            templateUrl: 'assignment/views/users/login.view.html',
                            controller: 'LoginController'
                        })
                    .when('/register',
                        {
                            templateUrl: 'assignment/views/users/register.view.html',
                            controller: 'RegisterController'
                        })
                    .otherwise({
                        redirectTo: '/home'
                    });

                $locationProvider.html5Mode(true);

                console.log("route config finished");
            });
})();