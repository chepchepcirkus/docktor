var express = require('express')
var router = express.Router();

router.get('/', function(req, res) {
    req.app.docker.listContainers({all: true}, function(err, containers) {
        if(err) {
            req.app.session.setMessage({type : 'error', text: err.message});
        }
        req.app.renderData.data = {
            title:'Containers list',
            content: '<h2>Container list</h2>',
            dockerhtml : {
                method : 'renderContainersList',
                data : containers
            }
        };
        res.render('default', req.app.renderData);
    });
})
.get('/view/:id', function(req, res) {
	var container = req.app.docker.getContainer(req.params.id)
	var dataForView = {}
    container.inspect(function (err, data) {
        if(err) {
            req.app.session.setMessage({type : 'error', text: err.message});
        }
    	dataForView['inspect'] = data;
    })
    // var stateOpts = {}
    // container.state(stateOpts, function(err, data){
    // 	dataForView['state'] = data;
    // })
    var logOpts = {
        stdout: 1,
        stderr: 1,
        tail:100,
        follow:0
    };
    container.logs(logOpts, function(err, data) {
        if(err) {
            req.app.session.setMessage({type : 'error', text: err.message});
        }
        dataForView['log'] = '';
        data.setEncoding('utf8');
        data.on('data', function (data) {
            for(var i in data) {
                dataForView['log'] += data[i];
            }
        });
    });
    req.app.renderData.data = {title:'Detail', dockerhtml : {method : 'renderContainerView', data : dataForView}};
    res.render('default', req.app.renderData);
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