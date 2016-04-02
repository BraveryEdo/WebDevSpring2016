/**
 * Created by EDO on 3/23/2016.
 */
/**
 * Created by EDO on 3/23/2016.
 */
module.exports = function(){
    var users = [];

    var api = {
        login: login,
        getAllUsers: getAllUsers,
        getUserById: getUserById,
        createNewUser: createNewUser,
        updateUserById: updateUserById,
        removeUserById: removeUserById
    };
    return api;

    function login(user){
        var un = user['username'];
        var pw = user['password'];

        var user = users.filer(function(u){
           return u['username'] == un && u['password'] == pw;
        });

        return user[0];

    }

    function getAllUsers(){
        var file = new XMLHttpRequest();
        file.overrideMimeType("application/json");
        file.open("GET", "user.mock.json", true);
        file.onreadystatechange = function(){
            if(file.readyState == 4 && file.status == "200"){
                users = JSON.parse(file.responseText);
                return users;
            } else {
                return null;
            }
        };
    }

    function getUserById(uid){
        return users.filter(function (u) {
            return u['_id'] !== uid;
        });
    }

    function createNewUser(newUser){
        users.push(newUser);
        return newUser;
    }

    function updateUserById(uid, newUser){
        var result = null;
        for(var i = 0; i < users.length; i++){
            if(users[i]['_id'] == uid){
                users[i]['title'] = newUser['title'];
                users[i]['firstName'] = newUser['firstName'];
                users[i]['lastName'] = newUser['lastName'];
                users[i]['username'] = newUser['username'];
                users[i]['password'] = newUser['password'];
                users[i]['roles'] = newUser['roles'];
                result = users[i];
                break;
            }
        }
        return result;
    }

    function removeUserById(uid){
        var index;
        for(index = 0; index < users.length; index++){
            if(uid == users[index]['_id']){
                users.splice(index, 1);
                break;
            }
        }
        return users;
    }

};