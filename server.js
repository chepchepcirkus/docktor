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

/** Init templating engine **/
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
require('./models/templating-engine.js')(app);

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