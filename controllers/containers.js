var RSVP = require('rsvp');
var Promise = RSVP.Promise;
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var containerLists = null;
    var getContainerList = function(req) {
        var dockPromise = new Promise(function(resolve, reject) {
            req.app.docker.listContainers({all: true}, function(err, containers) {
                if(err) reject(err);
                resolve(containers);
            })
        });
        return dockPromise;
    };

    getContainerList(req).then(
        function(containers) {
            containerLists = containers
        }, function(err) {
            req.app.session.setMessage({type : 'error', text: err.message});
            containerLists = [];
    }).finally(function() {
        req.app.renderData.data = {
            title:'Containers list',
            content: '<h2>Container list</h2>',
            dockerhtml : {method : 'renderContainersList', data : containerLists}
        };
        res.render('default', req.app.renderData);
    });
})
.get('/view/:id', function(req, res) {

    var dataForView = {};

	var container = req.app.docker.getContainer(req.params.id);

    container.inspect()
    .then(function(container) {
        container.logs(
            {
                stdout: 1,
                stderr: 1,
                tail: 100,
                follow: 0
            },function(err, data) {
                data.setEncoding('utf8');
                data.on('data', function (data) {
                    for (var i in data) {
                        dataForView['log'] += data[i];
                    }
                });
            }
        );
    })
    .catch(function(err) {
        req.app.session.setMessage({type: 'error', text: err.message});
    })
    .finally(function(){
        req.app.renderData.data = {
            title:'Containers View',
            content: '<h2>Container View</h2>',
            dockerhtml : {method : 'renderContainerView', data : dataForView}
        };

        res.render('default', req.app.renderData);
    });
})
.get('/start/:id', function(req, res) {
	var container = req.app.docker.getContainer(req.params.id)
	var opts = {}
    container.start(opts, function(err, data) {
        if(err) {
            req.app.session.setMessage({type : 'error', text: err.message});
        } else {
            req.app.session.setMessage({type : 'success', text: 'container has been started'});
        }
    	res.redirect('back')
    })
})
.get('/stop/:id', function(req, res) {
	var container = req.app.docker.getContainer(req.params.id)
	var opts = {}
    container.stop(opts, function(err, data) {
        if(err) {
            req.app.session.setMessage({type : 'error', text: err.message});
        } else {
            req.app.session.setMessage({type : 'success', text: 'container has been stopped'});
        }
    	res.redirect('back')
    })
})
.get('/remove/:id', function(req, res) {
	var container = req.app.docker.getContainer(req.params.id)
	var opts = {}
    container.remove(opts, function(err, data) {
        if(err) {
            req.app.session.setMessage({type : 'error', text: err.message});
        } else {
            req.app.session.setMessage({type : 'success', text: 'container has been removed'});
        }
    	res.redirect('back')
    })
})

module.exports = router