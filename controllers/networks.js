var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
    req.app.docker.listNetworks({all: true}, function(err, networks) {
        res.render('default', {
            data : {
                title:'Networks list',
                content: '<h2>Network list</h2>',
                dockerhtml : {
                    method : 'renderNetworksList',
                    data : networks
                }
            }
        })
    });
})
.get('/view/:id', function(req, res) {
	var network = req.app.docker.getNetwork(req.params.id);
    network.inspect(function (err, data) {
    	res.render('default', {data : {title:'Network Detail', dockerhtml : {method : 'renderNetworkView', data : data}}});
    });
})

module.exports = router