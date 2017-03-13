var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
    req.app.docker.listImages({all: true}, function(err, images) {
        if(err) {
            req.app.session.setMessage({type : 'error', text: err.message});
        }
        req.app.renderData.data = {
            title:'Images list',
            content: '<h2>Images list</h2>',
            dockerhtml : {
                method : 'renderImagesList',
                data : images
            }
        };
        res.render('default', req.app.renderData)
    });
})
.get('/view/:id', function(req, res) {
    req.app.use(express.static('public'));
	var image = req.app.docker.getImage(req.params.id)
	var dataForView = {}
    image.inspect(function (err, data) {
        if(err) {
            req.app.session.setMessage({type : 'error', text: err.message});
        }
    	dataForView['inspect'] = data;
    });
    image.history(function(err, data){
        if(err) {
            req.app.session.setMessage({type : 'error', text: err.message});
        }
    	dataForView['history'] = data;
    });
    req.app.renderData.data = {title:'Detail', dockerhtml : {method : 'renderImageView', data : dataForView}};
    res.render('default', req.app.renderData);
})

module.exports = router