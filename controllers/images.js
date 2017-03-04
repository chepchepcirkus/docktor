var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
    req.app.docker.listImages({all: true}, function(err, images) {
        res.render('default', {
            data : {
                title:'Images list',
                content: '<h2>Images list</h2>',
                dockerhtml : {
                        method : 'renderImagesList',
                    data : images
                }
            }
        })
    });
})
.get('/view/:id', function(req, res) {
    req.app.use(express.static('public'));
	var image = req.app.docker.getImage(req.params.id)
	var dataForView = {}
    image.inspect(function (err, data) {
    	dataForView['inspect'] = data;
    });
    image.history(function(err, data){
    	dataForView['history'] = data;
    });
    res.render('default', {data : {title:'Detail', dockerhtml : {method : 'renderImageView', data : dataForView}}});
})

module.exports = router