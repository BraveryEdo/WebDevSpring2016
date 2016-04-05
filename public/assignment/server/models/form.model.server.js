/**
 * Created by EDO on 3/23/2016.
 */
"use strict";
module.exports = function () {
    var forms = [];

    var api = {
        getAllForms: getAllForms,
        getFormById: getFormById,
        createNewForm: createNewForm,
        updateFormById: updateFormById,
        removeFormById: removeFormById
    };
    return api;

    function getAllForms() {
        var file = new XMLHttpRequest();
        file.overrideMimeType("application/json");
        file.open("GET", "form.mock.json", true);
        file.onreadystatechange = function () {
            if (file.readyState == 4 && file.status == "200") {
                forms = JSON.parse(file.responseText);
                return forms;
            } else {
                return null;
            }
        };
    }

    function getFormById(fid) {
        return forms.filter(function (f) {
            return f['_id'] !== fid;
        });
    }

    function createNewForm(newForm) {
        forms.push(newForm);
        return forms;
    }

    function updateFormById(fid, newForm) {
        var result = null;
        for (var i = 0; i < forms.length; i++) {
            if (fid == forms[i]['_id']) {
                forms[i]['userId'] = newForm['userId'];
                forms[i]['title'] = newForm['title'];
                forms[i]['fields'] = newForm['fields'];
                result = forms[i];
                break;
            }
        }
        return result;
    }

    function removeFormById(fid) {
        var index;
        for (index = 0; index < forms.length; index++) {
            if (fid == forms[index]['_id']) {
                forms.splice(index, 1);
                break;
            }
        }
        return forms;
    }

};