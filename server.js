var express = require('express');
var app = express();

/** Init logger **/
var logger = require('morgan');
app.use(logger('combined'));

/** Static file **/
app.use(express.static(__dirname + '/public'));

/** Init Session */
var Session = require('./models/session.js');
app.session = new Session(app);

/** Template engine **/
var fs = require('fs');
/**
 * options parameter must respect that format :
 *  {
 *      app : app,
 *      data : {
 *          ...
 *      }
 *  }
 */
// Init option parameter object for template engine
app.renderData = {app : app};

app.engine('.ntl', function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {

        if(err) {
            return callback(err);
        }
        var rendered = content.toString();

        // render common content
        var text = '';
        var variables = ['title', 'content'];
        for(var i in variables) {
            text = '';
            if(options.data[variables[i]] != undefined) {
                text = options.data[variables[i]];
            }
            rendered = rendered.replace('#' + variables[i] + '#', text);
        }

        // render session message
        if(options.app.session.messages.length > 0) {
            var mess = '';
            for(var i in options.app.session.messages) {
                var bgClass = 'bg-blue-light';
                switch(options.app.session.messages[i].type) {
                    case 'error': bgClass = 'bg-red-light';break;
                    case 'success': bgClass = 'bg-greenthea-light';break;
                }
                mess += '<div class="flash-message ' + bgClass + '">' + options.app.session.messages[i].message + '</div>';
            }
            rendered = rendered.replace('#message#', mess);
        } else {
            rendered = rendered.replace('#message#', '');
        }
        // flush session message
        options.app.session.flushMessage();

        // Render docker data
        if(options.data['dockerhtml'] != undefined) {
            text = options.app.dockerHtml.renderHtml(options.data['dockerhtml'].method, options.data['dockerhtml'].data);
            rendered = rendered.replace('#dockerhtml#', text);
        } else {
            rendered = rendered.replace('#dockerhtml#', '');
        }
        return callback(null, rendered);
    })
});
app.set('views', './views', [app]);
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
.use('/', function(req, res, next) {
    // Custom simple logger replaced by morgan logger, see at top
    // console.log('%s %s %s', req.method, req.url, req.path);
    next()
})
.use('/', home)
.use(['/containers', '/images', '/networks'], initDocker)
.use('/containers', containers)
.use('/images', images)
.use('/networks', networks)
.use('/about', about)
.use(function(req, res, next){
    res.status(404);
    req.app.renderData.data = {title : '404 Not found', content : 'Sorry... Page not found'};
    res.render('default', req.app.renderData);
})
.listen(8080);