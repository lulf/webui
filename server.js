<!--
/*
 * This file is part of EnMasse.
 *
 * Copyright (C) 2016 Red Hat, Inc.
 *
 */
-->
var express = require("express");
var http = require("http");
var app = express();

var enmasse_rest_location = process.env.OPENSHIFT_ENMASSE_REST || '10.16.40.63';
var enmasse_rest_port = process.env.OPENSHIFT_ENMASSE_REST_PORT || '80';
var enmasse_web_debug = process.env.OPENSHIFT_ENMASSE_WEB_DEBUG || false;

app.configure(function() {
    app.use(express.logger());
    app.set('views', __dirname + '/app');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/app'));
    app.use('/bower_components',  express.static(__dirname + '/app/bower_components'));
    app.use(app.router);
    app.engine('html', require('ejs').renderFile);
});

var fetchResponse = function(request, response, options, body) {
    var req = http.request(options, function(res) {
        var content = '';
        res.on('data', function(chunk) {
            content += chunk;
        });
        res.on('end', function() {
            enmasse_web_debug && console.log(content);
            if (content.length > 0) {
                try {
                    responseJson = JSON.parse(content);
                    if (responseJson['errors']) {
                        responseJson['errors'].forEach(function (error) {
                            console.log("Server responded with an error: " + error['details']);
                        });
                    }
                } catch (err) {
                    console.log("Failed parsing server response, content was: " + content);
                }
            }
            response.send(content);
        });
    })
    if (body != null) {
        req.write(body);
    }
    req.on('error', function(error) {
        // if this event handler is called, it means that the transport layer
        // between the node server and the enmasse-rest server is having
        // issues.
        console.log(error.message);
        response.status(500);
        response.send(error.message);
    });
    req.end();
};

app.get('/', function(request, response) {
    response.render('index.html')
});

app.get('/api/clusters', function(request, response) {
    var options = {
        host: enmasse_rest_location,
        port: enmasse_rest_port,
        path: '/clusters',
        method: 'GET'
    };
    fetchResponse(request, response, options, null);
});

app.get('/api/clusters/:id', function(request, response) {
    var options = {
        host: enmasse_rest_location,
        port: enmasse_rest_port,
        path: '/clusters/' + request.params.id,
        method: 'GET'
    };
    enmasse_web_debug && console.log("Fetching for id: " + request.params.id);
    fetchResponse(request, response, options, null);
});

app.post('/api/clusters', function(request, response) {
    var options = {
        host: enmasse_rest_location,
        port: enmasse_rest_port,
        path: '/clusters',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var jsonBody = JSON.stringify(request.body);
    enmasse_web_debug && console.log("Request body: " + jsonBody);
    fetchResponse(request, response, options, jsonBody);
});

app.put('/api/clusters/:id', function(request, response) {
    var options = {
        host: enmasse_rest_location,
        port: enmasse_rest_port,
        path: '/clusters/' + request.params.id,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var jsonBody = JSON.stringify(request.body);
    enmasse_web_debug && console.log("Request body: " + jsonBody);
    fetchResponse(request, response, options, jsonBody);
});

app.delete('/api/clusters/:id', function(request, response) {
    var options = {
        host: enmasse_rest_location,
        port: enmasse_rest_port,
        path: '/clusters/' + request.params.id,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    enmasse_web_debug && console.log("Performing delete for id: " + request.params.id);
    fetchResponse(request, response, options, null);
});

app.get('/enmasse-rest-location', function(request, response) {
    response.send(enmasse_rest_location)
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.listen(port, function() {
    console.log("Listening on " + port);
    console.log("EnMasse REST Server on " + enmasse_rest_location + ":" + enmasse_rest_port);
});
