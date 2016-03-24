/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function() {
    angular
        .module('FormMakerApp')
        .config(function ($routeProvider, $locationProvider) {
                $routeProvider
                    .when('/',
                        {
                            templateUrl: 'assignment/client/views/home/home.view.html',
                            controller: 'HomeController'
                        })
                    .when('/admin',
                        {

                            templateUrl: 'assignment/client/views/admin/admin.view.html',
                            controller: 'AdminController'
                        })
                    .when('/forms',
                        {
                            templateUrl: 'assignment/client/views/forms/forms.view.html',
                            controller: 'FormsController'
                        })
                    .when('/form-fields',
                        {
                            templateUrl: 'assignment/client/views/forms/form-fields.view.html',
                            controller: 'FormsFieldsController'
                        })
                    .when('/profile',
                        {
                            templateUrl: 'assignment/client/views/users/profile.view.html',
                            controller: 'ProfileController'
                        })
                    .when('/login',
                        {
                            templateUrl: 'assignment/client/views/users/login.view.html',
                            controller: 'LoginController'
                        })
                    .when('/register',
                        {
                            templateUrl: 'assignment/client/views/users/register.view.html',
                            controller: 'RegisterController'
                        })
                    .when('/project',
                        {
                            templateUrl: 'project/views/home/project.view.html',
                            controller: 'ProjectController'
                        })
                    .otherwise({
                        redirectTo: '/'
                    });

                $locationProvider.html5Mode(true);

                console.log("route config finished");
            });
})();