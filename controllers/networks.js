var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
    req.app.docker.listNetworks({all: true}, function(err, networks) {
        if(err) {
            req.app.session.setMessage({type: 'error', text: err.message});
        }
        req.app.renderData.data = {
            title:'Networks list',
            content: '<h2>Network list</h2>',
            dockerhtml : {
                method : 'renderNetworksList',
                data : networks
            }
        };
        res.render('default', req.app.renderData)
    });
})
.get('/view/:id', function(req, res) {
	var network = req.app.docker.getNetwork(req.params.id);
    network.inspect(function (err, data) {
        if(err) {
            req.app.session.setMessage({type: 'error', text: err.message});
        }
        req.app.renderData.data = {title:'Network Detail', dockerhtml : {method : 'renderNetworkView', data : data}};
    	res.render('default', req.app.renderData);
    });
})

module.exports = router