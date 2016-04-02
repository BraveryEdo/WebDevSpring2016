/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("FormsController", ['$scope', '$location', 'FormsService', 'UserService', FormsController]);

    function FormsController($scope, $location, FormsService, UserService){
        $scope.location = $location;

        //initialize
        UserService.getCurrentUser()
            .then(function(result){
            $scope.user = result;

            FormsService.findAllFormsForUser($scope.user["_id"], function($userForms){
                $scope.forms = $userForms;
                FormsService.form(function($f){
                    selectForm($f);
                });
            });
        },  function(err){
                $scope.user = null;
                console.log("no current user found to show forms for" + err);
            });


        //add a new form
        $scope.addForm = addForm;
        function addForm($name){
            var fields;
            if($scope.selectedForm == null){
                fields = [];
            } else {
                fields = $scope.selctedForm['fields'];
            }

            if($name == "" || $name == null){
                window.alert("Please set a name or select a form");
            } else {
                var form = {
                    "_id": (new Date).getTime(),
                    "title": $name,
                    "userId": $scope.user["_id"],
                    "fields": fields
                };
                FormsService.createFormForUser($scope.user["_id"], form)
                    .then(function ($res) {
                        $scope.forms = $res;
                        selectForm(form);
                },  function(err){
                        console.log("same form name found for this user, aborting creation to avoid duplicates " + err);
                        window.alert("You already have a form with this name, please use another name");
                    });
            }
        }

        //update an existing form
        $scope.updateForm = function($form){
            if($scope.selectedForm !== null && $scope.selectedForm['_id'] == $form['_id']){
                $form['title'] = $scope.newFormName;}

            FormsService.updateFormById($form['_id'], $form)
                .then(function(res){
                        console.log("updating " + $scope.Username + "'s form, id#" + $form["_id"]);
                        selectForm(res);
                        $location.url('/form-fields');
            },      function(err){
                        console.log("form update failed " + err);
            });
        };

        $scope.deleteForm  = function($form){
            FormsService.deleteFormById($form["_id"])
            .then(function(res){
                $scope.forms = res;
            }, function(err){
                console.log("unable to delete form " + err);
            });
        };

        $scope.selectForm  = selectForm;
        function selectForm($form) {
                FormsService.setForm($form)
                    .then(function ($res) {
                        $scope.newFormName = $res["title"];
                        $scope.selectedForm = $res;
                }, function(err){
                        //form deselected
                        $scope.newFormName = null;
                        $scope.selectedForm = null;
                    });
        }
        console.log("forms controller finished loading");
    }
})();