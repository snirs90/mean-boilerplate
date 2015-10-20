'use strict';

var app = require('./app');

var nconf = require('nconf');
var logger = require('winston');

var server = app.listen(nconf.get('app').port, function () {
    var port = server.address().port;
    logger.info('server listening at http://localhost:%s', port);
});