/** Template engine **/
var fs = require('fs');

var render = function (filePath, options, callback) {

    try {
         return fs.readFile(filePath, function (err, content) {

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
        });
    } catch(err) {
     callback(err);
    }
};



module.exports = function (app) {
    app.engine('ntl', render);
    app.set('views', './views', [app]);
    app.set('view engine', 'ntl');
};