var express = require('express');
var app = express();

/** Static file **/
app.use(express.static('public'));

/** Template engine **/
var fs = require('fs');
app.engine('.ntl', function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {

        if (err) return callback(err);
        var rendered = content.toString();
        var text = '';
        var variables = ['title', 'message', 'content'];
        for(var i in variables) {
            text = '';
            if(options.data[variables[i]] != undefined) {
                text = options.data[variables[i]];
            }
            rendered = rendered.replace('#' + variables[i] + '#', text);
        }

        if(options.data['dockerhtml'] != undefined) {
            var DockerHtml = require('./views/docker-html.js');
            var dockHtml = new DockerHtml();
            text = dockHtml.renderHtml(options.data['dockerhtml'].method, options.data['dockerhtml'].data);
            rendered = rendered.replace('#dockerhtml#', text);
        } else {
            rendered = rendered.replace('#dockerhtml#', '');
        }
        return callback(null, rendered);
    })
});
app.set('views', './views');
app.set('view engine', 'ntl');

/** Router **/
// common router 
var initDocker = express.Router()

initDocker.use(function(req, res, next) {
    /** Specific Docker **/
    var Docker = require('dockerode');
    req.app.docker = new Docker({host: '0.0.0.0', port: 2375});
    var DockerHtml = require('./views/docker-html.js')
    req.app.dockerHtml = new DockerHtml(req.app);
    next()
});
// specific routers
var containers = require('./controllers/containers');
var images = require('./controllers/images');
var networks = require('./controllers/networks');
var home = require('./controllers/home');
var about = require('./controllers/about');

app
.use('/', home)
.use(['/containers', '/images', '/networks'], initDocker)
.use('/containers', containers)
.use('/images', images)
.use('/networks', networks)
.use('/about', about)
.use(function(req, res, next){
    res.render('default', {data : {title : '404 Not found', content : 'Sorry... Page not found'}});
})
.listen(8080);