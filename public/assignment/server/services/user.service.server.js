"use strict";
module.exports = function (app, userModel, LocalStrategy, bcrypt, passport) {

    app.post("/api/user", getAllUsers);
    app.get("/api/user/:id", getUserById);
    app.post("/api/user", createNewUser);
    app.put("/api/user/:id", updateUserById);
    app.get("/api/user/name/:username", findUserByUsername);
    app.delete("/api/user/:id", removeUserById);
    app.post("/api/login", passport.authenticate('local'), login);
    app.get("/api/loggedin", loggedin);
    app.post("/api/logout", logout);

    //app.get   ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    //app.get('/auth/facebook/callback',
    //    passport.authenticate('facebook', {
    //        successRedirect: '/profile',
    //        failureRedirect: '/login'
    //    }));
    //
    //app.get   ('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    //app.get   ('/auth/google/callback',
    //    passport.authenticate('google', {
    //        successRedirect: '/profile',
    //        failureRedirect: '/login'
    //    }));

    //var googleConfig = {
    //    clientID        : process.env.GOOGLE_CLIENT_ID,
    //    clientSecret    : process.env.GOOGLE_CLIENT_SECRET,
    //    callbackURL     : process.env.GOOGLE_CALLBACK_URL
    //};
    //
    //var facebookConfig = {
    //    clientID        : process.env.FACEBOOK_CLIENT_ID,
    //    clientSecret    : process.env.FACEBOOK_CLIENT_SECRET,
    //    callbackURL     : process.env.FACEBOOK_CALLBACK_URL
    //};




    var service = {
        login: login,
        logout: logout,
        getAllUsers: getAllUsers,
        getUserById: getUserById,
        createNewUser: createNewUser,
        removeUserById: removeUserById,
        updateUserById: updateUserById,
        findUserByUsername: findUserByUsername
    };

    //passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    //passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    return service;



    //function facebookStrategy(token, refreshToken, profile, done) {
    //    userModel
    //        .findUserByFacebookId(profile.id)
    //        .then(
    //            function(user) {
    //                if(user) {
    //                    return done(null, user);
    //                } else {
    //                    var names = profile.displayName.split(" ");
    //                    var newFacebookUser = {
    //                        lastName:  names[1],
    //                        firstName: names[0],
    //                        email:     profile.emails ? profile.emails[0].value:"",
    //                        facebook: {
    //                            id:    profile.id,
    //                            token: token
    //                        }
    //                    };
    //                    return userModel.createUser(newFacebookUser);
    //                }
    //            },
    //            function(err) {
    //                if (err) { return done(err); }
    //            }
    //        )
    //        .then(
    //            function(user){
    //                return done(null, user);
    //            },
    //            function(err){
    //                if (err) { return done(err); }
    //            }
    //        );
    //}
    //
    //function googleStrategy(token, refreshToken, profile, done) {
    //    userModel
    //        .findUserByGoogleId(profile.id)
    //        .then(
    //            function(user) {
    //                if(user) {
    //                    return done(null, user);
    //                } else {
    //                    var newGoogleUser = {
    //                        lastName: profile.name.familyName,
    //                        firstName: profile.name.givenName,
    //                        email: profile.emails[0].value,
    //                        google: {
    //                            id:          profile.id,
    //                            token:       token
    //                        }
    //                    };
    //                    return userModel.createUser(newGoogleUser);
    //                }
    //            },
    //            function(err) {
    //                if (err) { return done(err); }
    //            }
    //        )
    //        .then(
    //            function(user){
    //                return done(null, user);
    //            },
    //            function(err){
    //                if (err) { return done(err); }
    //            }
    //        );
    //}

    function localStrategy(username, password, done) {
        userModel
            .login({username: username, password: password})
            .then(
                function(user) {
                    if (!user) { return done(null, false); }
                    return done(null, user);
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .getUserById(user['_id'])
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function login(req, res) {
        var u = req.body;
        userModel.login(u).then(function(r){ res.json(r) });
    }

    function loggedin(req, res) {
        res.json(req.isAuthenticated() ? req.user : null);
    }

    function logout(req, res) {
        res.json(null);
    }

    function getAllUsers(req, res) {
        var roles = req.body;
        userModel.getAllUsers(roles).then(function(r){res.json(r);});

    }

    function findUserByUsername(req, res){
        var un = req.params['username'];
       userModel.getUserByName(un).then(function(r){res.json(r);});
    }

    function getUserById(req, res) {
        var uid = req.params['id'];
        userModel.getUserById(uid).then(function(r){res.json(r);});

    }

    function createNewUser(req, res) {
        var newUser = req.body;
        userModel.createNewUser(newUser).then(function(r){res.json(r);});
    }

    function updateUserById(req, res) {
        var uid = req.params['id'];
        var newUser = req.body;
        userModel.updateUserById(uid, newUser).then(function(r){res.json(r);});
    }

    function removeUserById(req, res) {
        var uid = req.params['id'];
       userModel.removeUserById(uid).then(function(r){res.json(r);});
    }
};
