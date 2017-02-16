var express = require('express')
var app = express()

/** Template engine **/
var fs = require('fs')
app.engine('.ntl', function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {

        if (err) return callback(err)
        var rendered = content.toString();
        var text = '';
        var variables = ['title', 'message', 'content']
        for(var i in variables) {
            text = '';
            if(options.data[variables[i]] != undefined) {
                text = options.data[variables[i]];
            }
            rendered = rendered.replace('#' + variables[i] + '#', '<p>' + text + '</p>')
        }

        if(options.data['dockerhtml'] != undefined) {
            var DockerHtml = require('./views/docker-html.js')
            var dockHtml = new DockerHtml();
            rendered += dockHtml.renderHtml(options.data['dockerhtml'])
        }
        return callback(null, rendered)
    })
})
app.set('views', './views')
app.set('view engine', 'ntl')

/** Router **/
var router = express.Router()

router.get('/', function(req, res) {
    res.render('home', {data:{title:'Docktor', message:'Welcome here'}})
})
.get('/about', function(req, res) {
    res.render('default', {data: {title:'About'}})
})
.use('/container', function(req, res, next) {
    /** Specific Docker **/
    var Docker = require('dockerode');
    req.docker = new Docker({host: '0.0.0.0', port: 2375});
    next()
})
.get('/container/list', function(req, res) {
    req.docker.listContainers({all: true}, function(err, containers) {
        //console.log('ALL: ' + containers.length);
        res.render('default', {data : {title:'Containers list', dockerhtml : {'containers-list':containers}}})
    });
})
.use(function(req, res, next){
    res.render('404', {data : {title : '404 Not found', message : 'sorry...'}})
});
app.use('/', router).listen(8080)
