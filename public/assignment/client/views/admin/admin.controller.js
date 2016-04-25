"use strict";
(function(){

 angular
     .module("FormMakerApp")
     .controller("AdminController", ['$scope', '$location','UserService', AdminController]);

 function AdminController($scope, $location, UserService){
     $scope.location = $location;
     $scope.remove = remove;
     $scope.edit = edit;
     console.log("admin controller finished loading");
     var selectedUser = null;
     UserService.getCurrentUser().then(function(u){
         UserService.getAllUsers(u['roles']).then(function (r) {
             $scope.Users = r.data;
         }, function(err){
             console.log(err);
         });
     });

     function remove(user){
         UserService.removeUser(user['_id']).then(function(res){
             if(selectedUser !== null && selectedUser['_id'] == user['_id']){
                 selectedUser = null;
             }
            UserService.getAllUsers().then(function(r){
                $scope.Users = r.data;
            });
         }, function(err){
             console.log("error deleting user from admin panel");
         })
     }

     function edit(user){
         if(selectedUser !== null && selectedUser['_id'] == user['_id']){
             selectedUser = null;
         } else {
             selectedUser = user;
         }
     }
 }
})();
