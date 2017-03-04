var express = require('express')
var router = express.Router();

router.get('/', function(req, res) {
    req.app.docker.listContainers({all: true}, function(err, containers) {
        res.render('default', {
            data : {
                title:'Containers list',
                content: '<h2>Container list</h2>',
                dockerhtml : {
                    method : 'renderContainersList',
                    data : containers
                }
            }
        })
    });
})
.get('/view/:id', function(req, res) {
	var container = req.app.docker.getContainer(req.params.id)
	var dataForView = {}
    container.inspect(function (err, data) {
    	dataForView['inspect'] = data;
    })
    var stateOpts = {}
    container.state(stateOpts, function(err, data){
    	dataForView['state'] = data;
    })
    var logOpts = {}
    container.logs(logOpts, function(err, data) {
    	dataFoView['log'] = data
    })
    res.render('default', {data : {title:'Detail', dockerhtml : {method : 'renderContainerView', data : dataForView}}});
})
.get('/start/:id', function(req, res) {
	var container = req.app.docker.getContainer(req.params.id)
	var opts = {}
    container.start(opts, function(err, data) {
    //@todo set up session message
    // with error
    	res.redirect('back')
    })
})
.get('/stop/:id', function(req, res) {
	var container = req.app.docker.getContainer(req.params.id)
	var opts = {}
    container.stop(opts, function(err, data) {
    //@todo set up session message
    // with error
    	res.redirect('back')
    })
})

module.exports = router