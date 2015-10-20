"use strict";

var q = require('Q');

var User      = require('../models/User');

module.exports = {
    getUserById: getUserById,
    getUserByEmail: getUserByEmail,
    getUserByConfirmationToken: getUserByConfirmationToken,
    create: create
};

/**
 * Get user by id.
 *
 * @param {int} userId
 * @returns {*}
 */
function getUserById(userId){
    return User.findOne({ _id: userId, active: true, deletedAt: null }).select({ _id: 1, password: 1, active: 1, deleted_at: 1 }).exec();
}

/**
 * Get user by email.
 *
 * @param {string} email
 * @returns {*}
 */
function getUserByEmail(email){
    return User.findOne({ email: email, active: true, deleteAt: null }).select({ _id: 1, password: 1, active: 1, deletedAt: 1 }).exec();
}

/**
 * Get user by confirmation token.
 *
 * @param {string} token
 * @returns {*}
 */
function getUserByConfirmationToken(token){
    return User.findOne({ confirmationToken: token, deleteAt: null }).select({ _id: 1, active: 1, deletedAt: 1 }).exec();
}

/**
 * Create a new user.
 *
 * @param {*} data - the user data.
 * @returns {*}
 */
function create(data) {
    var userData = {
        email: data.email,
        password: data.password,
        confirmationToken: data.confirmationToken,
        active: data.active
    };

    return Q.ninvoke(User, 'create', userData);
}