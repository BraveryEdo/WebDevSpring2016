/**
 * Created by EDO on 3/23/2016.
 */
var model = require('nodejs-model');

var user = model("User")
    .attr('firstName', {})
    .attr('lastName', {})
    .attr('username', {})
    .attr('password', {
    validations: {
        length: {
            minimum: 5,
            maximum: 20,
            messages: {
                tooShort: 'password is too short!',
                tooLong: 'password is too long!'
            }
        }
    },
    //this tags the accessibility as _private_
    tags: ['private']})
    .attr('roles', {});
