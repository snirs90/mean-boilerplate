'use strict';

var path = require('path');
global.appRoot = path.resolve(__dirname);

/* NPM MODULES */
var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var expressValidator = require('express-validator');
var nconf = require('nconf');
var jwt = require('express-jwt');
var cors = require('cors');
var Q = require('q');

// Express app.
var app = express();

/* CUSTOM MODULES */
var configure = require('../config');
var restAPIFormatter = require('./core/middlewares/RestAPIFormatter');
var JwtFormatter = require('./core/middlewares/JwtFormatter');
var logger;

/**
 * Start the server configuration process.
 */
Q.when(configure)
    .then(setupApp)
    .then(registerModules)
    .then(setupSecurity)
    .then(registerModuleRoutes)
    .catch(function(err) {
        logger.error(err);
    });

/* ############### PRIVATE FUNCTIONS ############### */

/**
 * Setup the application configurations.
 * @returns {boolean}
 */
function setupApp() {

    logger = require('./core/config/logger');

    app.use(compress());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: false}));

    // parse application/json
    app.use(bodyParser.json());

    app.use(expressValidator());

    app.use(cors());

    // Rest API formatter
    app.use(restAPIFormatter);

    return true;
}

/**
 * Setup app security configurations.
 *
 * @param {*} modules - the modules references.
 */
function setupSecurity(modules) {
    // jwt middleware
    app.use('/api',
        jwt({secret: nconf.get('auth').token.secret})
            .unless({ path: nconf.get('security').excludeRoutes }),
        modules.security.authentication().unless({ path: nconf.get('security').excludeRoutes })
    );

    // last middleware to catch unauthorized requests
    app.use(JwtFormatter);

    return modules;
}

/**
 * Register the modules.
 * @returns {exports}
 */
function registerModules() {
    return require('./modules');
}

/**
 * Register modules routes.
 * @param modules
 */
function registerModuleRoutes(modules) {
    return require('./core/registerRoutes')(app, modules);
}

module.exports = app;