'use strict';

var mongoose     = require('mongoose');
var soft_delete = require('mongoose-softdelete');
var _           = require('lodash');

var dbConnection = require(appRoot + '/core/config/databases/mongo');
var UserUtils = require('../utils/UserUtils');


var Schema = mongoose.Schema;

var UserSchema = new Schema({

    email: {
        type: String,
        unique: true
    },

    password: {
        type: String
    },

    active: {
        type: Boolean,
        default: false
    },

    confirmationToken: {
        type: String
    },

    resetPasswordToken: {
        type: String
    }

}, {
    collection: 'users',
    timestamps: true
});

UserSchema.plugin(soft_delete);

UserSchema.pre('save', function (next) {
    var user = this;

    if(!user.isModified('password') || _.isEmpty(user.password)) {
        return next();
    }

    UserUtils.encryptPassword(user.password)
        .then(function(hash) {
            user.password = hash;
            next();
        })
        .catch(function(err) {
            logger.error('Error encrypting password.', err);
            next(err);
        });
});

module.exports = dbConnection.model('User', UserSchema);