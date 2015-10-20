'use strict';

var User = require('./models/User');

var Q = require('q');

/**
 * Drop the users table and then create fictive user entities in the DB
 * @return {Promise}
 */
function seedUsers(){

    return Q.ninvoke(User, 'remove')
        .then(function(){
            var userData = {
                email: 'example@email.com',
                password: '1234'
            };
            return Q.ninvoke(User, 'create', userData);
        })
        .catch(function(err){
            console.log(err.message);
        });
}

module.exports = seedUsers;